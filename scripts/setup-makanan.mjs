import fs from "fs";
import path from "path";

const srcDir = "Makanan";
const destDir = "public/makanan";

fs.mkdirSync(destDir, { recursive: true });

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const files = fs.readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

const results = files.map((f) => {
  const ext = path.extname(f).toLowerCase();
  const name = path.basename(f, path.extname(f));
  const slug = slugify(name);
  const dest = `${slug}${ext}`;
  fs.copyFileSync(path.join(srcDir, f), path.join(destDir, dest));
  return { original: f, name, slug, image: `/makanan/${dest}` };
});

console.log(JSON.stringify(results, null, 2));
console.error(`Copied ${results.length} files`);
