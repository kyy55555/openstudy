function Title(props) {
  return (
    <>
      <h1>{props.text}</h1>
      <p>{props.subtitle}</p>
    </>
  );
}

function SearchBox() {
  return (
    <div>
      <input placeholder="Search for a subject" />
      <button>Search</button>
    </div>
    
  );
}

export default function Home() {
  return (
    <main>
        <Title text="OpenStudy"
               subtitle="Learn from the world's best universities."/>
        <SearchBox />
      </main>
  );
}