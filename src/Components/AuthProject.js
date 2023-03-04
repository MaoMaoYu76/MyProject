const AuthProject = (props) => {
  const [canvasData, setCanvasData] = useState();
  const [previewimg, setpreviewimg] = useState();

  const handleLoad = (event) => {
    // e.target.id
    const canvasData = {};
    // console.log(event);
    getDocs(collection(db, `${currentUser.uid}`)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === event.target.id) {
          canvasData[doc.id] = { ...doc.data() };
          setCanvasData(canvasData);
        }
      });
    });
  };
  return (
    <div className="single-project" onClick={handleLoad}>
      <div className="preview">
        <img className="previewimg" src={props.src} id={props.id} />
      </div>
      <div className="project-name">咩咩咩咩au, au ,au,咩咩咩 咩</div>
      <div className="project-type">海報</div>
    </div>
  );
};

export default AuthProject;
