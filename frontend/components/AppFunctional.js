import React from 'react'
import { useState } from 'react'
// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  //const [currentIndex, setcurrentIndex]=useState(4);

  const [message, setMessage]=useState(initialMessage);
  const [email, setEmail]=useState(initialEmail);
  const [steps, setSteps]=useState(initialSteps);
  const [currentIndex, setcurrentIndex]=useState(initialIndex);




  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.

    let matrix = [ //[col, row]
        [1,1],[2,1],[3,1],
        [1,2],[2,2],[3,2],
        [1,3],[2,3],[3,3]
      ];
    let divArray = Array.from(document.querySelectorAll("#grid div"));
    for (let i = 0; i < divArray.length; i++) {
        let currentItem = divArray[i];
        if(currentItem.textContent === "B") {
          let x = matrix[i][1];
          let y = matrix[i][0];
          return {y,x}
        }
    }
   
    // const x = currentIndex % 3 + 1
    // const y = Math.floor(currentIndex / 3) + 1
    // return { x, y }

  }

  function getIndexFromXY ({y, x}) {
    
    return (((x-1) * 3 + y) - 1 )
    
    
  }


  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    let coordinates = getXY()
    console.log(coordinates);
    return `Koordinatlar (${coordinates.y}, ${coordinates.x})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMessage('');
    setEmail('');
    setSteps(0);
    setcurrentIndex(4);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let coordinates = getXY()
    if (yon === "left") {
      if (coordinates.y === 1) {
        setMessage("Sola gidemezsin")
      } else {
        coordinates.y = coordinates.y - 1;
        setcurrentIndex(getIndexFromXY(coordinates))
       
      }
    } else if (yon === "right"){
      if(coordinates.y === 3){
        setMessage("Sağa gidemezsin")
      } else {
        coordinates.y = coordinates.y + 1;
        setcurrentIndex(getIndexFromXY(coordinates))
      }
    } else if (yon === "up"){
      if(coordinates.x === 1){
        setMessage("Yukarı gidemezsin")
      } else {
        coordinates.x = coordinates.x - 1
        setcurrentIndex(getIndexFromXY(coordinates))
      }
    } else if (yon === "down") {
      if (coordinates.x === 3){
        setMessage("Asagi gidemezsin")
      }else{
        coordinates.x = coordinates.x + 1
        setcurrentIndex(getIndexFromXY(coordinates))
      }
    } else if (yon === "reset") {
      // yon değil ama reset id'si gelince reset'lesin diye bu formüle ekledik.
      reset()
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    // burada hangi düğmeye tıklanırsa onun id'sini alıyoruz.
    let findID = evt.target.getAttribute("id");
    // id yön belirttiği için yon parametresi alan formülü çağırıyoruz.
    sonrakiIndex(findID);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    let coordinates = getXY();

    fetch("https://localhost:9000/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         },
      body: JSON.stringify({
        x: coordinates.x,
        y: coordinates.y,
        steps: steps,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
  }
  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar (2, 2)</h3>
        <h3 id="steps">0 kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left">SOL</button>
        <button id="up">YUKARI</button>
        <button id="right">SAĞ</button>
        <button id="down">AŞAĞI</button>
        <button id="reset">reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

