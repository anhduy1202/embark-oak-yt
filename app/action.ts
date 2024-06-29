"use server";
import { productType } from '@/lib/interface';
import { defineOneEntry } from 'oneentry'
import { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
const {
    Admins,
    AttributesSets,
    Blocks,
    Forms,
    Orders,
    FormData,
    FileUploading,
    GeneralTypes,
    Locales,
    Menus,
    Pages,
    Products,
    ProductStatuses,
    System,
    Templates,
    TemplatePreviews,
    Payments
} = defineOneEntry('https://embarkoak.oneentry.cloud', { token: process.env.ONEENTRY_TOKEN, langCode: 'en' })
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Get all data from a page by url
export async function getPageData(url: string) {
    const value = await Pages.getPageByUrl(url, 'en_US')
    const bannerData = {
        title: value.attributeValues?.maintitle.value,
        image: value.attributeValues?.mainimage.value[0].downloadLink
    }
    if (value.attributeValues?.hasOwnProperty('categoriestitle') && value.attributeValues?.categoriestitle.value != '') {
        const categoriesData = {
            titles: value.attributeValues?.categoriestitle.value.split(","),
            images: value.attributeValues?.categoriesimage.value.map((item: any) => item.downloadLink),
            links: value.attributeValues?.categorieslink.value.split(",")
        }
        const categoriesObject = categoriesData.titles.map((title: string, index: any) => ({
            id: "cate" + title,
            title: title.toLocaleUpperCase(),
            imgSrc: categoriesData.images[index],
            url: categoriesData.links[index]
        }));
        return {bannerData, categoriesObject}
    }
    return {bannerData}
}
//helper function to parse product
const parseProductObject = (value:any) => {
    const products: productType[] = value.map((product: IProductsEntity) => ({
        id: product.id,
        src: product.attributeValues.images.value[0].downloadLink,
        title: product.attributeValues.title.value,
        price: product.attributeValues.price.value,
        quantity: product.attributeValues.quantity.value,
        description: product.attributeValues.description.value,
        images: product.attributeValues.images.value.map((v:any) => v.downloadLink),
        categories: product.attributeValues.categories.value
    }))
    return products
}

export async function getProductsByCategory(url: string) {
    const body = [
        {
            "attributeMarker": "price",
            "conditionMarker": "mth",
            "conditionValue": 1,
        }
    ]
    const value = await Products.getProductsByPageUrl(url, body, 'en_US')
    const products = parseProductObject(value)
    return products
}

export async function getProductByID(id: number)  {
    const value = await Products.getProductById(id, 'en_US')
    const products = parseProductObject([value])
    return products
}

export const parseCartDetail = (cartDetails: any) => {
    let result = Object.keys(cartDetails).map(key => {
        let item = cartDetails[key];
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        };
    });
    let total = result.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    },0)
    return {result, total}
}

const parseFormDetails = (form: IFormsEntity) => {
    const formFields = form.attributes.map((att)=>att.localizeInfos.title)
    return formFields
}

export async function getFormByMarker(marker:string) {
    const value = await Forms.getFormByMarker(marker, "en_US")
    const formFields = parseFormDetails(value)
    return formFields
}

export async function postFormData(data:any) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
        },
    })
    const plainText = `
    Name: ${data.name}
    Address: ${data.address}
    Email: ${data.email}
    Cart Items:
    ${data.cart.map((item: any) => `
      - Item: ${item.name}
        Description: ${item.description}
        Price: $${item.price}
        Quantity: ${item.quantity}
        Image: ${item.image}
    `).join('')}
    Total: $${data.total}
    `;
    
        const htmlText = `
    <h2>Order Details</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <h3>Cart Items:</h3>
    <ul>
      ${data.cart.map((item: any) => `
        <li>
          <p><strong>Item:</strong> ${item.name}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><img src="${item.image}" alt="${item.name}" width="100" /></p>
        </li>
      `).join('')}
    </ul>
    <p><strong>Total:</strong> $${data.total}</p>
    `;
    //Shop admin
    const orderEmailOptions: Mail.Options = {
        from: process.env.MY_EMAIL,
        to: process.env.MY_EMAIL,
        subject: `Order from: ${data.name}, ${data.email}, ${data.address}`,
        text: plainText,
        html: htmlText
    };
    //Client
    const confirmationEmailOptions: Mail.Options = {
        from: process.env.MY_EMAIL,
        to: data.email, //Send to customer email
        subject: `Order confirmation for ${data.name}`,
        text: plainText,
        html: htmlText
    };
    const sendMailPromise = (emailOptions: any) =>
        new Promise<string>((resolve, reject) => {
            transport.sendMail(emailOptions, function (err) {
                if (!err) {
                    resolve('Email sent');
                } else {
                    reject(err.message);
                }
            });
    });
    try {
        await Promise.all([
            sendMailPromise(confirmationEmailOptions),
            sendMailPromise(orderEmailOptions)
        ])
        return { status: 200, message: "Email sent" }
    } catch (err) {
        return { status: 500, message: "Failed to send email" }
    } 
}