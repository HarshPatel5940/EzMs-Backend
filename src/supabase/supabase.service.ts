import { Injectable } from "@nestjs/common";
import { Express } from "express";
import * as fs from "fs";
import { Multer } from "multer";
import { createClient } from "@supabase/supabase-js";
import { timestamp } from "rxjs";
import * as timers from "timers";

const supabase = createClient(
    // TODO: implement config service and constructor
    "",
    "",
);

@Injectable()
export class SupabaseService {
    async uploadFile(file: Express.Multer.File) {
        const time = Date.now();
        const { data, error } = await supabase.storage
            .from("EzMs-bucket")
            .upload(
                `/data/${file.originalname}-${time}.${
                    file.mimetype.split("/")[1]
                }`,
                file.buffer,
            );

        console.log(data);

        if (error) {
            // Handle error
            throw error;
        } else {
            return data.path;
        }
    }
}
