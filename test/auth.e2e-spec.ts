import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import {
    email,
    password,
    badPwd,
    name,
    testAdminEmail,
    testAdminPassword,
} from "./constants";

describe("AuthController (e2e)", () => {
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

    it("/auth/signin 400 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signin")
            .send({
                name: email,
                password,
            })
            .expect(400);
    });

    it("/auth/signin 400 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signin")
            .send({
                email,
                password: badPwd,
            })
            .expect(400);
    });

    it("/auth/signin 403 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signin")
            .send({
                email,
                password,
            })
            .expect(403);
    });

    it("/auth/signup 400 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signup")
            .send({
                email: name,
                password: badPwd,
            })
            .expect(400);
    });

    it("/auth/signup 400 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signup")
            .send({
                name,
                password: badPwd,
            })
            .expect(400);
    });

    it("/auth/signup 400 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signup")
            .send({
                name,
                email,
                password: badPwd,
            })
            .expect(400);
    });

    it("/auth/signup (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signup")
            .send({
                name,
                email,
                password,
            })
            .expect(201);
    });

    it("/auth/signup 409 (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signup")
            .send({
                name,
                email,
                password,
            })
            .expect(409);
    });

    it("/auth/signin (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/auth/signin")
            .send({
                email,
                password,
            })
            .expect(200);
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

    it("/admin/delete/test-users (POST)", () => {
        console.log(accessToken);
        return request(app.getHttpServer())
            .delete("/api/admin/delete/test-users")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
