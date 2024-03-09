
import './App.css';

function App() {
  return (
    <main>
      <header>
        <a href="" className="logo">MyBlog</a>
        <nav>
          <a href="">Login</a>
          <a href="">Register</a>
        </nav>
      </header>
      <div className="post">
        <div className="image">
          <img src="https://th.bing.com/th/id/R.7cdf60c7cd8b2b14995694dcd7c99e06?rik=3obl%2fhI6QdNIMA&riu=http%3a%2f%2fthewowstyle.com%2fwp-content%2fuploads%2f2015%2f01%2ffree-beautiful-place-wallpaper-hd-173.jpg&ehk=92RRpT4hrYheMDBZkK0HhLLXx9%2fGDjnafeDmbgjE1K8%3d&risl=1&pid=ImgRaw&r=0" alt=""></img>
        </div>
        <div className="texts">
          <h2>Test</h2>
          <p className="info">
            <a className="author">Test</a>
            <time>2023-01-06</time>
          </p>
          <p classname="summary">aloooooooooooooooooo</p>  
        </div>
      </div>
      
    </main>
  );
}

export default App;
