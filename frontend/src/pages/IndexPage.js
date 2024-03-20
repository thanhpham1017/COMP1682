import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(reponse => {
            reponse.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return(
    <>
        {posts.length > 0 && posts.map(post => (
            <Post {...post} />
        ))}
    </>
    );
    //mongoose.connect('mongodb+srv://foodmap:webne123@cluster0.escyyuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}