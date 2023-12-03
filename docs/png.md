# PetitPNG

*petit* lib for PNG binary generation

## download

[png.mjs](../png.mjs)

## exports

- png({ data *Array*, width *Number*, height *Number*, palette? *Number*, alpha=false *Boolean* }) => RGB *Array(3)*  
  converts raw data to PNG

  - data *Array*
    Array of index number or RGB(A) value *Number*
  - width *Number*
    width of the image
  - height *Number*
    height of the image
  - palette *Number*
    color palette of the image if needed
  - alpha *Boolean*
    set true when data(RGB mode) or palette(indexed mode) contains alpha value

  ```js
  import{png}from'./png.mjs';
  open(
    png({
      data:[...Array(15*16)].map(_=>Math.random()*8|0),
      width:15,height:16,
      palette:[0x88,0xff000088,0xff0088,0xff88,0x00ffff88,0xff00ff88,0xffff0088,0xffffff88],
      alpha:true
    }).toDataURL()
  )
  ```
