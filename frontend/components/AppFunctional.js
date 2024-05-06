import React from "react";
import { useState, useEffect } from "react";
// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 0;

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  //const [currentIndex, setcurrentIndex]=useState(4);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [grid, setGrid] = useState([]); // Grid generation için gerekli olan state bu canım
  const [gridDimensions, setGridDimensions] = useState({}); // Initial dimensions

  function initialIndexGenerator() {}

  // function getXY() {
  //   // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
  //   // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  //   let currentRowIndex = -1;
  //   let currentColIndex = -1;
  //   let colCount = grid[0].length
  //   console.log('grid : ', grid);
  //   if (currentIndex % colCount == 0) {
  //     currentRowIndex = currentIndex / colCount - 1;
  //     currentColIndex = colCount - 1;
  //   } else {
  //     currentRowIndex = Math.floor(currentIndex / colCount);
  //     currentColIndex = (currentIndex % colCount) - 1;
  //   }
  //   return {currentColIndex, currentRowIndex}
  // }

  function getXY() {
    let colCount = grid[0].length;
    let rowCount = grid.length;
    let currentColIndex = currentIndex % colCount + 1;
    let currentRowIndex = Math.floor(currentIndex / colCount) + 1; // Add 1 to represent 1-based indexing
  
    // Adjust the currentRowIndex if the B is at the top end of the grid
    if (currentRowIndex > rowCount) {
      currentRowIndex = rowCount;
    }
  
    return { currentColIndex: currentColIndex, currentRowIndex: currentRowIndex };
  }
  
  
  
  
  
  

  function getIndexFromXY({ y, x }) {
    let colCount = grid[0].length
    return (x - 1) * colCount + y - 1;
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    let coordinates = getXY(grid[0].length);
    console.log(coordinates);
    return `Koordinatlar (${coordinates.y}, ${coordinates.x})`;
  }

  function reset() {
    // Reset all states to their initial values
    setMessage("");
    setEmail("");
    setSteps(0);
    setcurrentIndex(initialIndex);
  
    // Generate the grid again after resetting with the stored dimensions
    if (gridDimensions.rows && gridDimensions.cols) {
      generateGrid(gridDimensions);
    }
  }
  
  

  // function sonrakiIndex(yon) {
  //   // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
  //   // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
  //   // şu anki indeksi değiştirmemeli.
  //   let coordinates = getXY();
  //   //todo:...
  //   let colCount = grid[0].length;
  //   let rowCount = grid.length;

  //   if (yon === "left") {
  //     if (coordinates.y === 1) {
  //       setMessage("Sola gidemezsin");
  //     } else {
  //       coordinates.y = coordinates.y - 1;
  //       setcurrentIndex(getIndexFromXY(coordinates));
  //     }
  //   } else if (yon === "right") {
  //     if (coordinates.y === colCount) {
  //       setMessage("Sağa gidemezsin");
  //     } else {
  //       coordinates.y = coordinates.y + 1;
  //       setcurrentIndex(getIndexFromXY(coordinates));
  //     }
  //   } else if (yon === "up") {
  //     if (coordinates.x === 1) {
  //       setMessage("Yukarı gidemezsin");
  //     } else {
  //       coordinates.x = coordinates.x - 1;
  //       setcurrentIndex(getIndexFromXY(coordinates));
  //     }
  //   } else if (yon === "down") {
  //     if (coordinates.x === rowCount) {
  //       setMessage("Asagi gidemezsin");
  //     } else {
  //       coordinates.x = coordinates.x + 1;
  //       setcurrentIndex(getIndexFromXY(coordinates));
  //     }
  //   } else if (yon === "reset") {
  //     // yon değil ama reset id'si gelince reset'lesin diye bu formüle ekledik.
  //     reset();
  //   }
  // }


  function sonrakiIndex(findID) {
    setcurrentIndex((prevIndex) => {
      let coordinates = getXY();
      let colCount = grid[0].length;
      let rowCount = grid.length;
  
      // Check if "B" is at the top border
      if (findID === "up" && coordinates.currentRowIndex === 1) {
        setMessage("Sola gidemezsin");
        return prevIndex;
      }
      // Check if "B" is at the left border
      else if (findID === "left" && coordinates.currentColIndex === 1) {
        setMessage("Yukarı gidemezsin");
        return prevIndex;
      }
      // Check if "B" is at the right border
      else if (findID === "right" && coordinates.currentColIndex === colCount) {
        setMessage("Aşağı gidemezsin");
        return prevIndex;
      }
      // Check if "B" is at the bottom border
      else if (findID === "down" && coordinates.currentRowIndex === rowCount) {
        setMessage("Sağa gidemezsin");
        return prevIndex;
      } else {
        // If not at a border, calculate the next index based on the movement direction
        if (findID === "up") {
          return prevIndex - colCount;
        } else if (findID === "left") {
          return prevIndex - 1;
        } else if (findID === "down") {
          return prevIndex + colCount;
        } else if (findID === "right") {
          // Check if "B" is at the top right corner
          if (coordinates.currentColIndex === colCount && coordinates.currentRowIndex === 1) {
            setMessage("Sağa gidemezsin");
            return prevIndex;
          }
          return prevIndex + 1;
        } else if (findID === "reset") {
          reset();
          return prevIndex;
        } else {
          return prevIndex;
        }
      }
    });
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

    fetch("http://localhost:9000/api/result", {
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
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  }

  //Funtions for RandomDimention and GridGeneration are below Backenden sevgilerle

  useEffect(() => {
    //  random dimensions'ı Fetchleyelim from the backend
    fetch("http://localhost:9000/randDimension")
      .then((response) => response.json())
      .then((data) => {
        const { rows, cols } = data;
        //  Grid'i random dimensions ile oluşturalım
        generateGrid(data);
      })
      .catch((error) =>
        console.error("Error fetching random dimensions:", error)
      );
  }, []);

  function generateGrid(dimensions) {
    // Fetch grid data from backend based on the dimensions
    fetch(
      `http://localhost:9000/generateGrid?rows=${dimensions.rows}&cols=${dimensions.cols}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Set the generated grid in state

        setGrid(data.grid.grid);
        setcurrentIndex(data.grid.initalIndex);
      })
      .catch((error) => console.error("Error fetching grid data:", error));
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar (2, 2)</h3>
        <div className="info">
  <h3 id="message">{message}</h3>
</div>
        <h3 id="steps">0 kere ilerlediniz</h3>
      </div>
      <div>{currentIndex}</div>
      <div id="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`square${(getIndexFromXY({y:colIndex+1, x: rowIndex+1}) == currentIndex) ? " active" : ""}`}
              >
                {
                  (getIndexFromXY({y:colIndex+1, x: rowIndex+1}) == currentIndex) ? 'B': '0'
                }
                 
                
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
  
  <button onClick={ilerle} id="up">
    SOL
  </button>
  <button onClick={ilerle} id="left">
    YUKARI
  </button>
  <button onClick={ilerle} id="right">
    AŞAĞI
  </button>
  <button onClick={ilerle} id="down">
    SAĞ
  </button>
  <button onClick={ilerle} id="reset">
    reset
  </button>
</div>


      <form>
        <input id="email" type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
