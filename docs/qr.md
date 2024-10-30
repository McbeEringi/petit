# PetitQR

*petit* lib for QRCode encoding

## Download

[qr.mjs](../qr.mjs)

## Dependencies

[PetitPNG](../docs/png.md)

## Exports

```js
import{png}from'./png.mjs';

class QR{

  /*

  constructor({te})
  
    te (optional) : TextEncoder for text encode in QRCode's "8-bit mode"

  => instance of QR

  */
  constructor( { te=new TextEncoder() }={} ){
    return this;
  }

  /*

  gen(w,{ecl,ver,mask,te})
  
    w (optional) : Array of String to encode
                   individual "Mode" is detected for each String

    ecl (optional) : ErrorCorrectionLevel of QRCode
                      0: L, 1: M, 2: Q, 3: H
    ver (optional) : Version of QRCode
                      1 ~ 40
                      Set 0 for auto determination
    mask (optional) : Mask of QRCode
                      0 ~ 7
                      Set -1 for auto determination
    te (optional) : TextEncoder for text encode in QRCode's "8-bit mode"
                    Leave empty will use "te" defined in constructor

  => QRCodeStructure

  */
  gen( w=[], { ecl=0, ver=0, mask=-1, te }={} ){

    /*

    QRCodeStructure{}

      toPNG({bg,fg,scale,padding}) : returns PNGStructure

        bg : background (light module) color represented in 32bit number (0xRRGGBBAA)

        fg : foreground (dark module) color represented in 32bit number (0xRRGGBBAA)

        scale : scale of module

        padding : padding around QRCode
                  At least 4 is required as "Quiet Zone" in QRCode spec

    */
    return {
      toPNG({ bg=0xffffffff, fg=0x000000ff, scale=4, padding=4 }){
        /*

        PNGStructure{}
        see PetitPNG doc

          toBlob()
          toDataURL()

        */
        return png();
      }
    };
  }
}

export{png,QR};
```

### Example

```js
import{QR}from'./qr.mjs';

// Open QRCode image in new tab
// First string will be encoded in "8-bit mode (UTF-8)"
// Second string will be encoded in "Alphanumeric mode"

open(
  new QR().gen(['new Date().toISOString() == ',new Date().toISOString()]).toPNG().toDataURL()
);

```