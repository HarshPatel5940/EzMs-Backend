<div align="center">
<h1> EzMs Backend</h1>
<p> A Simple, versatile and Robust CMS API made using NestJs, Prisma and Supabase! </p>
<p>
  <a href="https://nestjs.com/" target="blank"><img src="https://repository-images.githubusercontent.com/654061696/0dac8f4c-53e9-4ca9-823e-df9afd606b4d" alt="EzMs Banner" /></a>
</p>

</div>

## Installation

1. Install the dependencies

```bash
pnpm i
```

2. Generate Schema Types
```
pnpm dlx prisma generate
```

3. Make sure to
    - Create a .env file in the root directory
    - Run `pnpm devdb:reset` so it runs all the dev migrations and push it to the database
    - Check the `package.json` file for more scripts, so you can use docker and other stuff

To Start Development Server

```bash
pnpm run dev
```

To Start Production Server

```bash
pnpm run start
```

## License

EzMs is [MIT licensed](LICENSE).
