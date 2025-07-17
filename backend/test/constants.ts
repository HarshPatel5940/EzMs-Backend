const name: string = `test-${crypto.randomUUID().replace("-", "")}`;
const name2: string = `test-${crypto.randomUUID().replace("-", "")}`;
const email: string = `${name}@gmail.com`;
const email2: string = `${name}@gmail.com`;
const password: string = "HelloWorld";
const badPwd: string = "hmm";

const testAdminEmail: string = "test@gmail.com";
const testAdminPassword: string = "damnnu";

export {
    name,
    email,
    name2,
    email2,
    password,
    badPwd,
    testAdminEmail,
    testAdminPassword,
};
