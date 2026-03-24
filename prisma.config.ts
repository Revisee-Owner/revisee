import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    url: process.env.DATABASE_URL!,
  },
});
```

Save. Then remove the `url` from `prisma/schema.prisma` like I said — change:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```
datasource db {
  provider = "postgresql"
}