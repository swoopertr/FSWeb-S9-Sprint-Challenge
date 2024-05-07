import React, { useEffect } from 'react'
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
  const [coordinates, setCoordinates] = useState({});
  const [dimention, setDimention] = useState({rows:3,cols:5});

  useEffect(()=>{
    
    

    getRandFromBackend();
    
    let myBody = document.getElementsByTagName("body")[0];
    myBody.addEventListener("keydown", (evt)=> {
      onKeyDown(evt)
    })

  },[]);

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMessage('');
    setEmail('');
    setSteps(0);
    getRandFromBackend()
  }

  const getRandFromBackend = async ()=>{
    let requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         },
    };
    const result = await fetch("http://localhost:9000/randDimension", requestObj);
    const resultJson = await result.json();
    console.log(resultJson);
    setDimention(resultJson)
    const rand = Math.floor(Math.random() * resultJson.rows * resultJson.cols);
    setcurrentIndex(rand);
  }

  function getXY() {
    const y = currentIndex % dimention.cols + 1
    const x = Math.floor(currentIndex / dimention.cols) + 1
    return { y, x }
  }

  function getIndexFromXY ({y, x}) {
    const result = (((x-1) * dimention.cols + y) - 1 );
    return result;
  }


  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    let coordinates = getXY()
    console.log(coordinates);
    return `Koordinatlar (${coordinates?.y}, ${coordinates?.x})`
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let coordinates_ = getXY();
    if (yon === "left") {
      if (coordinates_.y === 1) {
        setMessage("Sola gidemezsin")
      } else {
        coordinates_.y = coordinates_.y - 1;
        const tempIndex = getIndexFromXY(coordinates_);
        setcurrentIndex(tempIndex);
        setSteps(steps+1);
       
        // backend yazılıcınca bunun comment'i kaldırılabilir.
        // checkTreasury()
      }
    } else if (yon === "right"){
      if(coordinates_.y === dimention.cols){
        setMessage("Sağa gidemezsin")
      } else {
        coordinates_.y = coordinates_.y + 1;
        const tempIndex = getIndexFromXY(coordinates_);
        setcurrentIndex(tempIndex);
        setSteps(steps+1);
        // backend yazılıcınca bunun comment'i kaldırılabilir.
        // checkTreasury()
      }
    } else if (yon === "up"){
      if(coordinates_.x === 1){
        setMessage("Yukarı gidemezsin")
      } else {
        coordinates_.x = coordinates_.x - 1
        const tempIndex = getIndexFromXY(coordinates_);
        setcurrentIndex(tempIndex);
        setSteps(steps+1);
        // backend yazılıcınca bunun comment'i kaldırılabilir.
        // checkTreasury()
      }
    } else if (yon === "down") {
      if (coordinates_.x === dimention.rows){
        setMessage("Asagi gidemezsin")
      }else{
        coordinates_.x = coordinates_.x + 1
        const tempIndex = getIndexFromXY(coordinates_);
        setcurrentIndex(tempIndex);
        setSteps(steps+1);
        // backend yazılıcınca bunun comment'i kaldırılabilir.
        // checkTreasury()
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
    let _email = evt.target.value;
    setEmail(_email);
  }

  async function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    let coordinates = getXY();
    let requestObj = {
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
    };
    const result = await fetch("http://localhost:9000/api/result", requestObj);
    const resultJson = await result.json();
    setMessage(resultJson.message);
    
  }
  function onKeyDown(evt) {
    if(evt.key === "ArrowRight") {
      document.getElementById('right').click();
    } else if(evt.key === "ArrowLeft") {
      document.getElementById('left').click();
    } else if(evt.key === "ArrowUp") {
      document.getElementById('up').click();
    } else if(evt.key === "ArrowDown") {
      document.getElementById('down').click();
    }
  }
  async function checkTreasury(index) {
    
    // backende POST request ile index gönderiyoruz.
    // gönderdiğimiz index backend'dekiyle örtüşürse oyunu bitir ve kutla, değilse false dön.
    let requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         },
      body: JSON.stringify({
        treasuryIndex: index
      }),
    };
    const result = await fetch("http://localhost:9000/api/result", requestObj);
    
    if (result) {
      //burada kutlama fonksiyonu çağırılabilir

    } else {
      return result;
    }

  }

  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h4>currentIndex : {currentIndex}</h4>
        <h3 id="coordinates">Koordinatlar {`(${Math.floor(currentIndex / dimention.cols) + 1} , ${currentIndex % dimention.cols + 1})`}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid" style={
        {
          gridTemplateColumns: [...Array(dimention.cols).keys()].map(x => "100px").join(" "),
          gridTemplateRows: [...Array(dimention.rows).keys()].map(x => "100px").join(" ")
        }
      } >
        {
          [...Array(dimention.rows * dimention.cols).keys()].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={ilerle}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange} value={email}></input>
        <input id="submit" type="submit" ></input>
      </form>
    </div>
  )
}

