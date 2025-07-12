export async function postData(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en POST:", error.message || error);
    return null;
  }
}

export async function getData(url) {
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch(error){
        console.error(`Error in GET: ${error}`);
    };
    
}

export async function putData(url, id, body){
  try{
    const response = await fetch(`${url}/${id}`,{
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(body)
    })
  } catch(error) {
    console.error(`Error in PUT: ${error}`)
  }
}

export async function deleteData(url, id){
  try{
    const response = await fetch(`${url}/${id}`,{
      method : "DELETE"
    })
  } catch(error){
    console.error(`Error in DELETE: ${error}`)
  }
}
