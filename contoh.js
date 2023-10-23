const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
};

const validateAndReturnInput = async (prompt, validatorFunction, errorMessage) => {
    const userInput = await question(prompt);
    if (validatorFunction(userInput)) {
        return userInput;
    } else {
        console.log(errorMessage);
        return validateAndReturnInput(prompt, validatorFunction, errorMessage);
    }
};

const tambahDataKeJSON = async () => {
    const nama = await validateAndReturnInput(
        "Masukkan nama anda ? ",
        (input) => input.length >= 3 && input.length <= 50,
        "Nama harus memiliki panjang minimal 3 karakter dan maksimal 50 karakter. Silakan coba lagi."
    );

    const handphone = await validateAndReturnInput(
        "Masukkan Nomor Handphone anda ? ",
        (input) => /^[0-9]{10,}$/.test(input),
        "Nomor Handphone tidak valid. Silakan coba lagi."
    );

    const email = await validateAndReturnInput(
        "Masukkan email anda ? ",
        (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input),
        "Alamat email tidak valid. Silakan coba lagi."
    );

    console.log(`Nama: ${nama}`);
    console.log(`Nomor Handphone: ${handphone}`);
    console.log(`Email: ${email}`);
    rl.close();
};

tambahDataKeJSON();
