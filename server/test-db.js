const prisma = require("./prisma/client");
async function main() {
  try {
    const count = await prisma.user.count();
    console.log("User count:", count);
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
