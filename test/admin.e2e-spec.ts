import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import {
    email2,
    name2,
    password,
    testAdminEmail,
    testAdminPassword,
} from "./constants";

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

    it("/admin/new/user (POST)", () => {
        return request(app.getHttpServer())
            .post("/api/admin/new/user")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                email: email2,
                name: name2,
                password: password,
            })
            .expect(201);
    });

    it("/admin/verify/user (PATCH)", () => {
        return (
            request(app.getHttpServer())
                .patch("/api/admin/verify/user")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    email: email2,
                    name: name2,
                })
                // sometimes it fails
                .expect(200)
        );
    });

    it("/admin/delete/test-users (POST)", () => {
        return request(app.getHttpServer())
            .delete("/api/admin/delete/test-users")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
