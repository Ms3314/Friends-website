import axios from "axios"
const server =  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Collect form data and log it directly
    const formData = {
      name: e.target.username.value,
      email: e.target.email.value,
      animal: e.target.animal.value,
      food: e.target.food.value,
      prefer1: e.target.desserts.value,
      color: e.target.color.value,
      prefer2: e.target.superpower.value,
    };

    axios.post(`${server}/api/data`, formData)
    .then(()=>{
      alert("Lesse meet your new friends !!")
      localStorage.setItem("form" , JSON.stringify(formData))
        window.location.reload()
    })
    .catch(()=>{
      alert("Something went wrong , please try using another email")
    })

  };

  return (
    <div className="p-10 flex flex-col justify-center bg-yellow-200 h-full items-center">
      <h1 className="font-mono text-pretty text-3xl font-extrabold bg-green-200 px-2 py-2  mb-10">Fraaands Game 🤍</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-[400px] p-7 rounded-lg bg-blue-300 justify-center items-center">
        
        <input type="text" name="username" className="rounded-xl w-[70%] py-2 pl-4" placeholder="username" required />
        <input type="email" name="email" className="rounded-xl w-[70%] py-2 pl-4 mb-2" placeholder="email" required />
        
        <label htmlFor="animal" className="text-xl text-slate-700 font-bold">What do you prefer More 😍?</label>
        <select name="animal" required className="rounded-xl w-[70%] py-2 pl-4">
          <option value="" disabled selected>Choose your option</option>
          <option value="Cats">Cats</option>
          <option value="Dogs">Dogs</option>
        </select>
        
        <label htmlFor="food" className="text-xl text-slate-700 font-bold">What do you prefer More 😋?</label>
        <select name="food" required className="rounded-xl w-[70%] py-2 pl-4">
          <option value="" disabled selected>Choose your option</option>
          <option value="Biriyani">Biriyani</option>
          <option value="Haleem">Haleem</option>
        </select>
        
        <label htmlFor="desserts" className="text-xl text-slate-700 font-bold">What do you prefer More 😋?</label>
        <select name="desserts" required className="rounded-xl w-[70%] py-2 pl-4">
          <option value="" disabled selected>Choose your option</option>
          <option value="Ice cream">Ice cream</option>
          <option value="Chocolate">Chocolate</option>
        </select>
        
        <label htmlFor="color" className="text-xl text-slate-700 font-bold">What color do you prefer 😀?</label>
        <select name="color" required className="rounded-xl w-[70%] py-2 pl-4">
          <option value="" disabled selected>Choose your option</option>
          <option value="Blue">Blue</option>
          <option value="Black">Black</option>
        </select>
        
        <label htmlFor="superpower" className="text-xl text-slate-700 font-bold">If you choose a superpower, what would you choose? 🤔</label>
        <select name="superpower" required className="rounded-xl w-[70%] py-2 pl-4">
          <option value="" disabled selected>Choose your option</option>
          <option value="Flying">Flying</option>
          <option value="Mind-reading">Mind-reading</option>
          <option value="Super strength">Super strength</option>
          <option value="Teleporting">Teleporting</option>
        </select>
        
        <button type="submit" className="bg-pink-200  text-slate-700 font-bold py-4 px-10 rounded-xl">Submit</button>
      </form>
    </div>
  );
}

export default Form;

