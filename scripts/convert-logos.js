const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

const LOGOS = [
    'logo-restaurant',
    'logo-retail',
    'logo-beauty',
    'logo-medical',
    'logo-education',
    'logo-realestate',
    'logo-construction',
    'logo-fitness',
    'logo-professional',
    'logo-default'
];

async function convertSvgToPng() {
    const defaultsDir = path.join(__dirname, '..', 'images', 'defaults');

    for (const logo of LOGOS) {
        const svgPath = path.join(defaultsDir, `${logo}.svg`);
        const pngPath = path.join(defaultsDir, `${logo}.png`);

        try {
            // SVGをPNGに変換
            await sharp(svgPath)
                .resize(400, 120) // 2倍のサイズで出力（Retinaディスプレイ対応）
                .png()
                .toFile(pngPath);

            console.log(`Converted ${logo}.svg to PNG`);
        } catch (error) {
            console.error(`Error converting ${logo}:`, error);
        }
    }
}

convertSvgToPng().catch(console.error); 