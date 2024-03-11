import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import { email2, testAdminEmail, testAdminPassword } from "./constants";

describe("AdminController (e2e)", () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api");
        await app.init();
    });

    it("/auth/signin (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signin")
            .send({
                email: testAdminEmail,
                password: testAdminPassword,
            })
            .expect(200)
            .then((response) => {
                accessToken = response.body.accessToken;
            });
    });

    it("/project/new (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/project/new")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                projectName: "testProject",
                projectDesc: "testDesc",
            })
            .expect(201);
    });

    // todo: do tests for creating new image inside project
    // not doing this rn as its a multipart form data
    // todo: based on the above todo, you can do tests related to projectData

    it("/project/:slug (PATCH)", () => {
        return request(app.getHttpServer())
            .patch("/api/project/testproject")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                projectName: "testproject1",
                projectDesc: "testDes1c",
            })
            .expect(200);
    });

    it("/project/:slug/access (PATCH)", async () => {
        const res = await request(app.getHttpServer())
            .patch("/api/project/testproject1/access")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                AddAccess: [testAdminEmail],
            })
            .expect(200);
        // todo: fix this! It work sometimes

        console.log(res, res.status);
        return res;
    });

    it("/project/:slug/token (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/project/testproject1/token")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(201);
    });

    it("/project/:slug (DELETE)", () => {
        return request(app.getHttpServer())
            .delete("/api/admin/delete/test-projects")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
