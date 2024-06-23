import { useState, useRef, useEffect  } from 'react';
import geminiApiCall from './api/gemini';
import './App.css';

function App() {

  const [file, setFile] = useState(null);
  const [base64File, setBase64File] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acordianContent, setAcordianContent] = useState({
    response: "notStarted",
    item: [],
    food: []
  });

  const inputRef = useRef();
  const mainRef = useRef();

  useEffect(()=>{
    console.log(acordianContent, typeof acordianContent);
  }, [acordianContent])

  useEffect(() => {
    if(!base64File) return;
  }, [base64File]);

  useEffect(()=>{
    let fileReader;
    if (file) {
      setFileType(file.type);
      fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        setBase64File(fileReader.result);
      }
    }
    return () => {
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [file])

  const scrollTo = () => { window.scrollTo({ top: mainRef.current.offsetTop, behavior: 'smooth', })};

  const handleImageClick = (e) => {
    if(e.target!=document.getElementsByClassName('uploadBtn')[0])
      inputRef.current.click();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  }

  const handleSearch = () => {
    if(!base64File) return;
    setLoading(true);
    geminiApiCall(base64File, fileType).then((res) => {
      setLoading(false);
      setAcordianContent(JSON.parse(res));
    }).catch((err) => {
      setLoading(false);
      setAcordianContent(null);
      console.log(err);
    });
  }

  return (
    <div className='mainPage'>
      <div className="hero">
        <div className="text">
          <h1>Recipe Remix</h1>
          <p className='tagline'>Discover Recipes from Your Photos</p>
          <p>Upload an image to get instant food content and recipe ideas tailored to your ingredients.</p>
          <button onClick={scrollTo}>upload</button>
        </div>
      </div>
      <div ref={mainRef} className="main">
        <div className="left">
          <div className="inputContainer" onClick={handleImageClick}>
            <h2>Upload an Image</h2>
            <img src={file? URL.createObjectURL(file) : ("/file_upload_icon.webp") } className='previewImage' alt="" />
            <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange}/>
            <button disabled={loading} className='uploadBtn' onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="right">
          {loading && <img src="/loader.gif" alt="loading" className='loading'/>}
          {!loading && acordianContent==null && <p className='errorMsg'>No response from server</p>}
          {!loading &&  acordianContent!=null && acordianContent.response==true && <div className='result'>
            <div className='identifiedItems'>
              <h2>Identified Items</h2>
              <div className='items'>
                {acordianContent.item.join(', ')}
              </div>
            </div>
            <div className="acordian">
              <h2>Recipes</h2>
              <div className='recipes'>
                {acordianContent.food.map((recipe, index) => {
                  return (
                    <div key={index} className='recipe'>
                      <h3>{recipe.food}</h3>
                      <ol>
                        {recipe.recipe.map((step, index) => {
                          return (
                            <li key={index}>{step}</li>
                          )
                        })}
                      </ol>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>}
          {!loading && acordianContent!=null && acordianContent.response==false && <p className='errorMsg'>No food  items identified</p>}
          {!loading && acordianContent!=null && acordianContent.response=="notStarted" && <p className='startMsg'>Upload an image see the magic happen</p>}
        </div>
      </div>
    </div>
  )
}

export default App
