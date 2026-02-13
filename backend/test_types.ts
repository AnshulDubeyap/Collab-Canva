
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSalt(10); // Promise<string>
const salt2 = 10;
const plain = 'password';

// Check type of hash without await
const h1 = bcrypt.hash(plain, 10);
// Check type with await
async function test() {
    const h2 = await bcrypt.hash(plain, 10);
    const fn = async () => {
        // Fix application
        const password: string = (await bcrypt.hash(plain, 10)) as string;
    }
}
