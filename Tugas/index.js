const fs = require('fs').promises;
const readline = require('readline');
const validator = require('validator');

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

const dataPath = './data/contacts.json';

const buatFolderDanFile = async () => {
    try {
        await fs.mkdir('./data');
        console.log("Folder 'data' berhasil dibuat.");
    } catch (error) {
        if (error.code === 'EEXIST') {
            console.log("Folder 'data' sudah ada.");
        } else {
            console.error("Terjadi kesalahan saat membuat folder: ", error);
        }
    }

    try {
        await fs.access(dataPath);
        console.log("File 'contacts.json' sudah ada.");
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(dataPath, '[]', 'utf-8');
            console.log('File contacts.json berhasil dibuat.');
        } else {
            console.error("Terjadi kesalahan saat membuat file: ", error);
        }
    }
};

const simpanDataKeJSON = async (data) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Data berhasil disimpan ke contacts.json.');
    } catch (error) {
        console.error("Terjadi kesalahan saat menyimpan data ke JSON: ", error);
    }
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
    await buatFolderDanFile();

    const nama = await validateAndReturnInput("Masukkan nama anda ? ", 
        (input) => validator.isLength(input, { min: 3, max: 50 }), 
        "Nama harus memiliki panjang minimal 3 karakter dan maksimal 50 karakter. Silakan coba lagi."
    );

    const handphone = await validateAndReturnInput("Masukkan Nomor Handphone anda ? ", 
        (input) => validator.isMobilePhone(input, "any"), 
        "Nomor Handphone tidak valid. Silakan coba lagi."
    );

    const email = await validateAndReturnInput("Masukkan email anda ? ", 
        (input) => validator.isEmail(input), 
        "Alamat email tidak valid. Silakan coba lagi."
    );

    const existingData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    existingData.push({ nama, handphone, email });
    await simpanDataKeJSON(existingData);

    console.log(`Nama saya adalah ${nama}, nomor telepon saya adalah ${handphone}, dan email saya ${email}. Thank You!!`);
    console.log(`Data anda telah disimpan. Terima kasih!`);
    rl.close();
};

tambahDataKeJSON();
