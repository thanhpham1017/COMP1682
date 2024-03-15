import Post from "../Post";

export default function IndexPage(){
    // useEffects(() => {
    //     fetch('http://localhost:4000/post', ).then(reponse => {
    //         reponse.json().then(posts => {
    //             console.log(posts);
    //         });
    //     });
    // }, []);
    return(
        <>
            <Post/>
            <Post/>
        </>
        
    );
    //mongoose.connect('mongodb+srv://foodmap:webne123@cluster0.escyyuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}