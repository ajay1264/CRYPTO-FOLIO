import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const userid = location.state.id;
  console.log(userid);

  const [userdata, setuserdata] = useState({});

  //-------------------------------------image------------------------------------------//

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }
  
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  
    try {
      const response = await fetch(process.env.REACT_APP_CLOUDINARY_API_URL, {
        method: "POST",
        body: data,
      });
  
      const result = await response.json();
      console.log("Image Uploaded Successfully:", result.url);
      setUrl(result.url);
  
      // Send Image URL to Backend
      const profileUpdateResponse = await fetch(
        "https://crypto-folio.onrender.com/dashboard/profileupdate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userid, ProfileUrl: result.url }),
        }
      );
  
      const json = await profileUpdateResponse.json();
      console.log("Profile Update Response:", json);
  
      // Navigate back to dashboard
      navigate("/dashboard", { state: { id: userid } });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

  //-------------------------------------image-----------------------------------------//

  useEffect(() => {
    const fetchuserdata = async () => {
      const response = await fetch(
        "https://crypto-folio.onrender.com/dashboard/userdetails",
        {
          method: "POST",
          body: JSON.stringify({ UserId: userid }),
          mode: "cors",
          headers: {
            "Content-type": "application/json",
          },

          header: "Access-Control-Allow-Origin: *",
        }
      );
      const json = await response.json();

      console.log("response we get from dashboard");
      console.log(json);
      setuserdata(json);
    };
    fetchuserdata();
  }, []);

  console.log(userdata);
  console.log(userdata.Data);
  console.log(userdata.userProfile);
  console.log(url);
  return (
    <div className="bg-[#171b26] h-screen pt-[100px] ">
      <div className="mx-auto mt-[150px] w-[70%] md:w-[50%] bg-[#272e41] rounded-lg p-5 ">
        <div className=" mx-auto">
          <div className="sm:w-[30%] mx-auto font-semibold">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
          </div>
          <div className="text-center m-5 text-[#090e1e]">
            {image ? (
              <button
                onClick={uploadImage}
                className="bg-[#209fe4] w-[100%] md:w-[30%]
             p-1 mt-6  rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Upload
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
