const fetch = require("node-fetch");
const NodeCache = require( "node-cache" );
const myCache=new NodeCache({stdTTL:100});

   
module.exports.ping=(req,res)=>{

        res.status(200).json({success:"true"})
        
};

module.exports.posts= async (req,res)=>{
    
    try
        {
            const sortValues=['id','reads','likes','popularity'];
            const apiurl='https://api.hatchways.io/assessment/blog/posts?tag=';
            const directionValues=['desc', 'asc'];
            
            const {tags,sortBy='id', direction='asc'}=req.query;



            if(!tags){
                return res.status(400).json({error: "Tags parameter is required"});
            }


            if(!sortValues.includes(sortBy)){
                        return res.status(400).json({error: "sortBy parameter is invalid"});
            }

            if(!directionValues.includes(direction)){
                        return res.status(400).json({error: "Direction parameter is invalid"});
            }       

            const myArray = tags.split(",");

            let data=[]
    

            const promises= myArray.map(async (tag)=>{
            

                    if(myCache.has(tag))
                        {
                
                            return myCache.get(tag)

                        }

                    else{
                            let promise=fetch(apiurl+tag).then(response=>response.json())
                            myCache.set(tag, promise)
                            return promise;
                        }
        
            });


            let dataarray= await Promise.all(promises)

            dataarray.map(t=> data.push(...t.posts))
    
            data=data
                .filter((value, index, array) =>index === array.findIndex((post) => (post.id === value.id)))
                .sort((p1,p2)=> {
                                    if (direction=='desc')
                                        return p2[sortBy]- p1[sortBy]
                                    else 
                                        return p1[sortBy]- p2[sortBy]
                })

            return res.status(200).json({posts:data})  
        }
        catch(error){

                    return res.status(400).json({error:error.message})

        }
}



        