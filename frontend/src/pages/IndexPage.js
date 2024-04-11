import Post from "../Post";
import React, { useEffect, useState, useContext, useRef } from "react";
import MapGL, {Marker} from 'react-map-gl';
import {UserContext} from "./UserContext";
import { GeolocateControl } from 'react-map-gl';
import Dropzone from 'react-dropzone';
// import axios from "axios";
import { FaMapMarker,FaStar,FaTimes   } from 'react-icons/fa';

export default function IndexPage(){
  const [posts,setPosts] = useState([]);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [price, setPrice] = useState(0);
  const [star, setStar] = useState(0);
  const {userInfo } = useContext(UserContext);
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null);
  const [currentPinId, setCurrentPinId] = useState(null);
  const [image, setImage] = useState([]); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState(''); // Trạng thái lưu trữ nội dung comment mới
  const [comments, setComments] = useState([]); // Trạng thái lưu trữ tất cả các comment của địa điểm được chọn

  const [viewport, setViewport] = useState({
    zoom: 13,
  });
  const GeolocateController = useRef();
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);

  useEffect(() => {
      fetch('http://localhost:4000/post').then(reponse => {
          reponse.json().then(posts => {
              setPosts(posts);
          });
      });
  }, []);

  useEffect(() => {
    const getPins = async () => {
      try {    
        const response = await fetch("http://localhost:4000/pins");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const pinsData = await response.json();
        setPins(pinsData);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    getPins();

    GeolocateControl.current?.trigger()
  }, [currentPlaceId, pins, viewport, GeolocateController]);
  
  

  const handleMarkerClick = (id, lat, long) => {
    setSelectedPin(pins.find(pin => pin._id === id));
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
    setSelectedMarkerInfo(pins.find(pin => pin._id === id));
    setCurrentPinId(id); // Lưu id của pin hiện tại
    setIsMarkerSelected(true);
  }

  const handleAddClick = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      long,
    });
  }
  const currentUser = userInfo?.username;

  const handleImageDrop = (acceptedFiles) => {
    // Xử lý khi người dùng tải lên hình ảnh
    const files = acceptedFiles.map(file => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(prevImages => [...prevImages, reader.result]); // Thêm hình ảnh vào mảng trạng thái
        };
        reader.readAsDataURL(file);
        return file;
    });
  };

  useEffect(() => {
    // Kiểm tra localStorage hoặc sessionStorage để lấy dữ liệu comment khi trang được load lại
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      return;
    }
    const newComment = {
      content: comment,
    };
    // Thêm comment mới vào state và lưu vào localStorage hoặc sessionStorage
    setComments(prevComments => ({
      ...prevComments,
      [currentPinId]: [...(prevComments[currentPinId] || []), newComment]
    }));
    localStorage.setItem('comments', JSON.stringify({...comments, [currentPinId]: [...(comments[currentPinId] || []), newComment]}));
    setComment('');
  };  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      price,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
      image: image,
    };
  
    try {
      const response = await fetch("http://localhost:4000/pinCreate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPin),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const pinData = await response.json();
      // Thêm mới đối tượng comment với key là id của pin và value là một mảng rỗng
      setComments(prevComments => ({ ...prevComments, [pinData._id]: [] }));
      setPins([...pins, pinData]);
      setNewPlace(null);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleCloseSidebar = () => {
    setIsMarkerSelected(false); // Đặt trạng thái marker đã được chọn là false khi người dùng đóng side bar
  };

  return(
    <div style={{position: "relative"}}>
        <MapGL
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          initialViewState={{
            ...viewport
          }}
          style={{width: "100%", height: "500px"}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onDblClick={handleAddClick}
          transitionDuration="200"
        >
          <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation={true} ref={GeolocateController} />
          {pins.map(p => (
            <Marker 
              longitude={p.long} 
              latitude={p.lat} 
              anchor="bottom" 
              key={p._id}
            >
              <FaMapMarker 
                style={{
                  fontSize: 300 / viewport.zoom,
                  color:"red",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id,p.lat,p.long) }
              />
            </Marker>
          ))}
          {newPlace && (
            <div className="sidebar" style={{position: "absolute", top: 0, right: 0, width: "460px", height: "460px", backgroundColor: "#fff", boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)", zIndex: 1000, overflowY: "auto"}}>
              <button onClick={() => setNewPlace(null)} style={{background: "none", border: "none", cursor: "pointer", position: "absolute", top: "10px", right: "10px"}}>
                <FaTimes style={{fontSize: "1.5rem"}} />
              </button>
              <form onSubmit={handleSubmit}>
                <div className="formCard">
                  <label>Name:</label><br />
                  <input 
                    className="formInput" 
                    placeholder="Enter name" 
                    onChange={(e) => setTitle(e.target.value)}
                  /><br />
                  <label>Review:</label><br />
                  <textarea className="formInput" 
                    placeholder="Say something about this place"
                    onChange={(e) => setDesc(e.target.value)}
                  ></textarea><br />
                  <label>Price:</label><br />
                  <input 
                    className="formInput" 
                    type="number" 
                    placeholder="Price" 
                    onChange={(e) => setPrice(e.target.value)}
                  /><br />
                  <div>
                    <a href="link-to-youtube">Youtube</a> // <a href="link-to-instagram">Instagram</a> // <a href="link-to-tiktok">Tiktok</a>
                  </div>
                  <Dropzone onDrop={handleImageDrop} accept="image/*" multiple={true}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} style={{ cursor: 'pointer', border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                            <input {...getInputProps()} />
                            {image.length > 0 ? (
                                <div>
                                    <img src={image[currentImageIndex]} alt={`Selected ${currentImageIndex}`} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }} />
                                    {image.length > 1 && (
                                        <div>
                                            <button onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? image.length - 1 : prevIndex - 1))}>Previous</button>
                                            <button onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === image.length - 1 ? 0 : prevIndex + 1))}>Next</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Drag 'n' drop images here, or click to select images</p>
                            )}
                        </div>
                    )}
                  </Dropzone>
                  <label>Rating:</label><br />
                  <select className="formInput" onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select><br />
                  <button className="formSubmitButton" type="submit">Add Pin</button><br />
                </div>
              </form>
            </div>
          )}
        </MapGL>
        {isMarkerSelected && (
          <div className="sidebar" style={{position: "absolute", top: 0, right: 0, width: "300px", height: "460px", backgroundColor: "#fff", boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)", zIndex: 1000, overflowY: "auto"}}>
            <button onClick={handleCloseSidebar} style={{background: "none", border: "none", cursor: "pointer", position: "absolute", top: "0", right: "10px"}}>
              <FaTimes style={{fontSize: "1.5rem"}} />
            </button>
            {selectedMarkerInfo && (
              <div className="marker-info">
                <div style={{position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, textAlign: "center"}}>
                  <button onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedMarkerInfo.image.length - 1 : prevIndex - 1))}>Previous</button>
                  <button onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === selectedMarkerInfo.image.length - 1 ? 0 : prevIndex + 1))}>Next</button>
                </div>
                <img src={selectedMarkerInfo.image[currentImageIndex]} alt="Marker" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                <h2>{selectedMarkerInfo.title}</h2>
                <p>{selectedMarkerInfo.desc}</p>
                <p>Price: {selectedMarkerInfo.price}</p>
                <div>
                  <a href="link-to-youtube">Youtube</a> // <a href="link-to-instagram">Instagram</a> // <a href="link-to-tiktok">Tiktok</a>
                </div>
                <div className="ratings">
                  {Array(selectedMarkerInfo.rating).fill(<FaStar className="star" />)}
                </div>
                <p>Posted by: {selectedMarkerInfo.username}</p>
                 {/* Form để thêm comment */}
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      className="formInput"
                      placeholder="Leave a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button className="formSubmitButton" type="submit">Submit</button>
                  </form>
                  {/* Danh sách các comment */}
                  <div className="comments">
                    <h3>Comments:</h3>
                    {selectedMarkerInfo && comments[currentPinId] && comments[currentPinId].map((comment, index) => (
                      <div key={index}>{comment.content}</div>
                    ))}
                  </div>
              </div>
            )}
          </div>
        )}
        <h1>Blog</h1>
        <div className="post-wrapper">
          {posts.length > 0 && posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
    </div>
  );
}