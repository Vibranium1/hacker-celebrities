import React, { useEffect, useState } from "react";
import DownArrow from "./downarrow.svg";
import UpArrow from "./up-arrow2.svg";
import Edit from "./edit.svg";
import Delete from "./trash.svg";
import Tick from "./tick.svg";
import Cancel from "./cancel.svg"
import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";
import "./hacker.css"

export default function Hacker() {
  const [data, setData] = useState<{ id: number; first: string; last: string; picture: string, gender:string, country:string,description:string,dob:string, email:string, age:any }[]>([]);
  const [originalData, setOriginalData] = useState<{ id: number; first: string; last: string; picture: string, gender:string, country:string,description:string,dob:string, email:string,age:any }[]>([]);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [age, setAge] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search,setSearch]=useState('')
  const optionsg=["male","female","transgender","rather not to say","other"] 
  const [originalgender,setGender]=useState("")
  const [ageError, setAgeError] = useState("");
  const [countryError, setCountryError]=useState("");
  const [descriptionError, setDescriptionError]=useState("")
  const [isDataChanged, setIsDataChanged] = useState(false);



  const handleEditChange = (id: number, field:  keyof typeof originalData[0], value: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
    
           
            const originalItem = originalData.find((original) => original.id === id);
            
            const isChanged = originalItem ? originalItem[field] !== value : false;
            
            setIsDataChanged(isChanged);
            return updatedItem;
          }
          return item;
        }
      )
    );
    setIsDataChanged(true);
  };




  const getData = async () => {
    fetch("celebrities.json")
      .then((res) => res.json())
      .then((myjson) => {
        setOriginalData(myjson);
      })

      .catch((err) => {
        console.log("err", err);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(data, "data");

  const handleClick = (id: number, dob: number) => {
    if (editingId !== null) return; 
    setOpen((prevState: any) => ({ ...prevState, [id]: !prevState[id] }));
    calculateage(dob,id);
  };

  const calculateage = (dob: any, id:number) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log(age);
    setAge(age);
    setData((prevData)=>
      prevData.map((item)=>
         item.id===id ? {...item,["age"]:age}:item
      )
    )
    setOriginalData((prevData)=> prevData.map((item)=>item.id===id ? {...item,["age"]:age}:item))
  };

  const handleDelete=(id:number)=>{
  //  console.log("idtodelete",id)
   var result = window.confirm("Are you sure you want to delete ?")
   if(result){
    setData(data.filter((item)=>{
      return item.id !== id ;
     }
     ))
     setOriginalData(data.filter((item)=>{
      return item.id!==id;
     }))
     

   }

  }
  
  useEffect(()=>{

      setData(
        search===""?originalData:
        originalData.filter((item)=>{
        const FullName = item.first+" " +item.last
        console.log(FullName, "fullname")
        if(FullName.toLowerCase().includes(search.toLowerCase())){
          return item
        }  
       }))  

   
  },[search,originalData])

  const handleSave=(id:number)=>{
    const editeddata=data.find(item=>item.id===id)

    console.log(editeddata,"editted data fromm save fn")

    if(!validatedata(editeddata)){
     alert("Please fix errors before saving")
     return ;
    }
     setOriginalData((prevData)=>prevData.map(item=> 
      item.id===id? {...item, ...editeddata}:item
      
      ))
      setEditingId(null)
      setIsDataChanged(false);
  }

  const validatedata =(editeddata:any)=>{
      console.log(editeddata,"editted data")
      console.log(editeddata.age,"age")
      console.log( typeof editeddata.age,"typeof age")
      const age = editeddata.age;
      if(!(/^\d+$/.test(editeddata.age))|| !String(editeddata.age).trim()){
        setAgeError("Age cannot be empty and must be a number")
        return false;
      }
      if(!editeddata.description.trim()){
        setDescriptionError("Description cannot be empty")
        return false;
      }
      if(!editeddata.country.trim()|| /\d/.test(editeddata.country)){
        setCountryError("Country cannot be empty and cannot contain number")
        return false;
      }
      setAgeError("")
      setCountryError("")
      setDescriptionError("")
      return true;
  }
  
  return (
    <div className="p-5 d-flex align-items-center justify=content-center hacker">
      <div className="website container border-secondary text-success " style={{ }}>
        <div>
          <h3>Celebrity List</h3>
          <input className="inputceleb border-secondary border"
            type="text"
            
            placeholder="Search celebrity..."
            value={search}
          onChange={(e)=>{
            setSearch(e.target.value)
                      }}
          />
        </div>
        {data &&
          data.length > 0 &&
          data.map((item: any) => {

            return (
              <div key={item.id}>
                <div
                  className="border datadisplay border-success p-3"
                >
                  <div>  
                    <div className="d-flex  align-item-center "
                    style={{
                      height: "100px",
                      position: "relative",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      className="rounded-circle"
                      src={item.picture}
                      alt="img"
                      style={{
                        objectFit: "fill",
                        width: "70px",
                        height: "70px",
                      }}
                    />
                    <div
                      className=""
                      style={{
                        marginLeft: "50px",
                        paddingTop: "20px",
                        fontSize: "22px",
                      }}
                    >
                      {editingId===item.id? (                  <div className="">
                      <input type="text border-secondary border"  style={{width:"100px", backgroundColor:"black",color:"green"}} value={item.first} onChange={(e)=>{ handleEditChange(item.id,"first",e.target.value)}}/>
                      <input type="text border-secondary border" style={{width:"100px",marginLeft:"30px",  backgroundColor:"black",color:"green"}} value={item.last} onChange={(e)=>{ handleEditChange(item.id,"last",e.target.value)}}/>
                      </div>
                      ): (`${item.first} ${item.last}`)}
                      
                    </div>

                    <img className="m-2"
                      src={open[item.id] ? UpArrow : DownArrow}
                      alt="svgicon m-5"
                      onClick={(event: any) => {
                        event.preventDefault();
                        handleClick(item.id, item.dob);
                      }}
                      style={{
                        height: "20px",
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                  <CCollapse visible={!!open[item.id]}>
   
                       <div className="container">

            <div className="row align-items-center" style={{ gap: "15px", marginBottom: "10px" }}>
              <div className="col-sm" style={{ textAlign: "left" }}>
                  <strong>Age:</strong>
              </div>
              <div className="col-sm" style={{ textAlign: "left" }}>
                <strong>Gender:</strong>
                  </div>
               <div className="col-sm" style={{ textAlign: "left" }}>
               <strong>Country:</strong>
                 </div>
                </div>


  <div className="row d-flex align-items-start" style={{ gap: "15px" }}>
    {editingId === item.id ? (
      <>
     
        <div className="col-sm" style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text border-secondary border"
            style={{ width: "100%", height: "36px",  backgroundColor:"black",color:"green" }}
            value={item.age}
            onChange={(e) => {
              const ageValue = e.target.value;
              handleEditChange(item.id, "age", ageValue);

               if(!ageValue.trim()){
                setAgeError("Age cannot be empty.");
              }
              else if (/^\d*$/.test(ageValue)) {
                setAgeError("");
              }  
              else {
                setAgeError("Only numeric values are allowed.");
              }
            }}
          />
          {ageError && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {ageError}
            </div>
          )}
        </div>

        
        <div className="col-sm">
          <select
            defaultValue={originalgender}
            style={{ width: "100%", height: "36px",  backgroundColor:"black",color:"green" }}
            onChange={(e) => handleEditChange(item.id, "gender", e.target.value)}
          >
            {optionsg.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        </div>

        
        <div className="col-sm">
          <input
            type="text border-secondary border"
            style={{ width: "100%", height: "36px",  backgroundColor:"black",color:"green" }}
            value={item.country}
            onChange={(e) => {
              let countryValue = e.target.value;
              handleEditChange(item.id, "country", countryValue);
              if (/\d/.test(countryValue)) {
                setCountryError("Country cannot contain numbers.");
              } else if (!countryValue.trim()) {

                setCountryError("Country cannot be empty.");
              } else {
                setCountryError("");
              }
            
            }
            
            }
          />
          {countryError && (
    <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
      {countryError}
    </div>
  )}
        </div>
      </>
    ) 


                        :( 
                          <> 
                             <div className="col-sm">{item.age}</div>
                        <div className="col-sm">{item.gender}</div>
                        <div className="col-sm">{item.country}</div>
                          </>

                        )}

                       
                      </div>
                    </div>

                    <div
                      className="py-1"
                      style={{ marginLeft: "15px", marginTop: "5px", display: "flex", flexDirection: "column"  }}
                    >
                      <strong style={{}}>Description:</strong>
                      {editingId===item.id?(
                      <div>
                       <textarea value={item.description} style={{width:"635px", height:"110px", marginTop:"10px",  backgroundColor:"black",color:"green"}}onChange={(e)=>{
                        const descriptiontext = e.target.value;
                        handleEditChange(item.id,"description",e.target.value)
                        if(!descriptiontext.trim()){
                          setDescriptionError("Description cannot be empty")
                        }
                        else{
                          setDescriptionError("")
                        }
                        }} ></textarea>
                      </div>):( <div style={{marginTop:"10px"}}>{item.description}</div>)}
                     
                      {descriptionError && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                       {descriptionError}
                         </div>
                        )}

                    </div>
                    <div className='d-flex' style={{ height: "20px",
                        marginLeft:"580px",
     
                        }}>
                          {editingId===item.id? (<>
                            <img  className='mx-2' src={Cancel} style={{width:"22px"}} onClick={()=>{
                           
                            setEditingId(null)
                            setAgeError("");
                            setCountryError("");
                            setDescriptionError("");
                            setData(originalData);

                            
                            
                          }} />
                          <button
                               disabled={!isDataChanged}
                                                 style={{
                                                   alignItems: "center",
                                                   justifyContent: "center",
                                                   padding: "10px",
                                                   backgroundColor: isDataChanged ? "#4CAF50" : "#F5F5F5", // Green when enabled, gray when disabled
                                                   border: "none",
                                                   borderRadius: "5px",
                                                   display: "flex",
                                                   cursor: isDataChanged ? "pointer" : "not-allowed",
                                              }}
                                        >
<img src={Tick} style={{width:"22px"}} onClick={()=> 
                            handleSave(item.id)
                        }
                          
                          />
</button>

                          
                          </>):(
                          <>
                          <img  className='mx-2' src={Edit} style={{width:"20px"}} onClick={()=>{
                            {item.age>18 ? setEditingId(item.id):setEditingId(null)}
                            setGender(item.gender) }
                          } />
                          <img src={Delete} onClick={()=>handleDelete(item.id)}/>
                           </>)}
                                          </div>
                  </CCollapse>
                  </div>
                  
            
                </div>
              </div>
            );
          })
          
          
          
          }
    

        

          
      </div>
    </div>
  );
}
