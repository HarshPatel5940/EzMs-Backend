import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("HealthController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api");
        await app.init();
    });

    it("/health (GET)", () => {
        return request(app.getHttpServer())
            .get("/api/health")
            .expect(200)
            .then((response) => {
                expect(response.body).toMatchObject({
                    data: "Pong 🏓",
                    Status: "All Services Operational",
                });
                expect(typeof response.body.timestamp).toBe("number");
            });
    });

    afterEach(async () => {
        await app.close();
    });
});
