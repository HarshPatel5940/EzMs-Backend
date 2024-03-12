import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnModuleInit {
    public isConnected: boolean = false;
    private readonly supabaseUrl;
    private readonly supabaseKey;
    private readonly SupabaseBucket;
    private readonly supabase: SupabaseClient;

    constructor(private readonly config: ConfigService) {
        this.supabaseUrl = this.config.get("SUPABASE_URL");
        this.supabaseKey = this.config.get("SUPABASE_KEY");
        this.SupabaseBucket = this.config.get("SUPABASE_BUCKET");

        if (!this.supabaseKey || !this.supabaseUrl) {
            Logger.error("Supabase Key or URL is not defined", "CONFIG");
            throw Error("[CONFIG] Supabase Key or URL is not defined");
        }
        Logger.debug("Supabase Credentials Found", "SupabaseLoader");
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    async onModuleInit() {
        const storageClient = createClient(this.supabaseUrl, this.supabaseKey, {
            db: { schema: "storage" },
        });

        const { data, error } = await storageClient
            .from("buckets")
            .select()
            .match({ name: this.SupabaseBucket })
            .single();

        if (error && !data) {
            Logger.error(error, "Supabase");
            throw new Error("Something Went Wrong While Fetching Bucket");
        }

        this.isConnected = true;
        Logger.debug("Supabase Credentials Verified", "SupabaseLoader");
    }

    async uploadFile(file: Express.Multer.File) {
        const time = Date.now();

        if (file.originalname.includes(".")) {
            file.originalname = file.originalname.replace(".", "-");
        }

        const filePath = `/data/${file.originalname}-${time}.${
            file.mimetype.split("/")[1]
        }`;
        const { data, error } = await this.supabase.storage
            .from(this.SupabaseBucket)
            .upload(filePath, file.buffer);

        if (error || !data) {
            Logger.error(error, "Supabase");
            throw new HttpException(
                "Something Went Wrong While Uploading",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return `${this.supabaseUrl}/storage/v1/object/public/EzMs-bucket${filePath}`;
    }
}
