import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  //we have a list of friends ul for each friend i want to create a component that has a button that opens the split form so on click on select
  //the form is displayed and if this state is found we render the form with && 
  const [form, setform] = useState(false);
  const [selectedfriend, setselectedfriend] = useState(null);
  function addformhandle() {
    setform(!form);
    setselectedfriend(null)
  }
  function handleSelection(friend) {
    // if (friend !== selectedfriend) setselectedfriend(friend);
    // else setselectedfriend(null);
    setselectedfriend(f=>f?.id===friend.id?null:friend)
    setform(false);
  }
  const [friends, setfriends] = useState(initialFriends);
  function Addnewfriend(friend) {
    setfriends((f) => [...f, friend]);
    setform(false);
  }
  function handlesplitbill(value){
    setfriends(friends.map(friend=>friend.id===selectedfriend.id?{...friend,balance:friend.balance+value}:friend));
    setselectedfriend(null)
  }
  return (//we pass to the friend list the function to handle selection,selectedfriend state which is prop drilling to the friend component 
    <div className="app">
      <div className="sidebar">
        <FriendList 
          fun={handleSelection}
          friends={friends}
          selectedfriend={selectedfriend}
        /> 
        {form && <AddForm Addnewfriend={Addnewfriend} />}
        <Button fun={addformhandle}>{form ? "close" : "add a friend"}</Button>
      </div>
      {selectedfriend && <FormSplitBill friend={selectedfriend} onsplit={handlesplitbill}/>}
    </div>
  );
}
function FriendList({ fun, friends, selectedfriend }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            onclick={fun}
            f={friend}
            selectedfriend={selectedfriend}
            key={friend.id}
          />
        ))}
      </ul>
    </>
  );
}
function Friend({ onclick, f, selectedfriend }) {
  let isselected=selectedfriend?.id === f.id;
  return (
    <li className={isselected ? "selected":""}>
      <img src={f.image} alt={f.name} />
      <h3>{f.name}</h3>
      {f.balance < 0 ? (
        <p className="red">you owe {f.name}{f.balance}</p>
      ) : f.balance > 0 ? (
        <p className="green">
          {f.name} owes you {f.balance}
        </p>
      ) : (
        <p>you and {f.name} are even</p>
      )}
      <div>
        <Button fun={() => onclick(f)}>
          {isselected ? "close" : "select"}
        </Button>
      </div>
    </li>
  );
}
function Button({ children, fun }) {
  return (
    <button onClick={fun} className="button">
      {children}
    </button>
  );
}
function AddForm({ Addnewfriend }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handelSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newfriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0,
    };
    Addnewfriend(newfriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>🧑‍🤝‍🧑 friend name</label>
      <input
        type="text"
        onChange={(e) => setname(e.target.value)}
        value={name}
      />
      <label>📷 image url</label>
      <input
        type="text"
        onChange={(e) => setimage(e.target.value)}
        value={image}
      />
      <Button>add</Button>
    </form>
  );
}
function FormSplitBill({friend,onsplit}) {
  const [bill,setbill]=useState();
  const [mybill,setmybill]=useState();
  const paidbyfriend=bill?bill-mybill:"";
  const [whoispaying,setwhoispaying]=useState('user');
  function handleSubmit(e){
    e.preventDefault();
    if(! bill || ! mybill) return;
    onsplit(whoispaying==='user'?paidbyfriend:-mybill)
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {friend.name}</h2>
      <label> bill value</label>
      <input type="text" onChange={(e)=>setbill(+e.target.value)} value={bill}/>
      <label>your expense</label>
      <input type="text"   onChange={(e)=>setmybill(+e.target.value>bill?bill:+e.target.value)} value={mybill}/>
      <label>{friend.name} expense </label>
      <input type="text" disabled value={paidbyfriend>0?paidbyfriend:''}/>
      <label>who is paying the bill</label>
      <select value={whoispaying} onChange={e=>setwhoispaying(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button >split bill</Button>
    </form>
  );
}
