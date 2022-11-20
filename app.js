const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");


const dbPath=path.join(__dirname,"cricketMatchDetails.Db")

const app.express()
app.use(express.json());

let db=null;


const initializeDbAndServer=async()=>{
    try{
     db=open({
         fileName:db.path;
         driver:sqlite3.database;
     });
     app.listen(3000,()=>{
         console.log("server Running at http://localhost:3000/");
     });

   }catch(error){
       console.log(`Db Error:${error.message}`);
       process.exit(1);
   }
}; 

initializeDbAndServer()

const convertPlayerDbObjectToResponseObject=(dbObject)=>{
  return{
    playerId:dbObject.player_id,
    playerName:dbObject.player_name,
  };
};
 const convertMatchDetaildDbObjectToResponseObject=(dbObject)=>{
     return{
        matchId:dbObject.match_id,
        match:dbObject.match,
        year:dbObject.year, 
     };
 };

app.get("/players/",async(request,response)=>{
    const getPlayersQuery=`
          select *
          From 
            player_details;`;
    const playerArray=await db.all(getPlayersQuery)
    response.send(playerArray=map((eachPlayer)=>convertPlayerDbObjectToResponseObject(eachPlayer))
    );
});


app.get("/players/:playerId",async(request,response)=>{
    const {playerId}=request.params;
    const getPlayerQuery=`
          select *
          From 
            player_details
            where player_id=${playerId};`;
    const player=await db.get(getPlayerQuery)
    response.send(convertPlayerDbObjectToResponseObject(player))
});

app.put("/players/:playerId",async(request,response)=>{
    const {playerId}=request.params;
    const {playerName}=request.body;
   
    const AddPlayerQuery=`
        update
        player_details
        set 
        player_name='${playerName}'
        where
        player_id=${playerId};`;
          
    await db.run(AddPlayerQuery)
    response.send("player Details Updated")
});
app.get("/matches/:matchId",async(request,response)=>{
    const {matchId}=request.params;
    const getMatchQuery=`
          select *
          From 
            match_details
            where match_id=${matchId};`;
    const match=await db.get(getMatchQuery)
    response.send(convertMatchDetaildDbObjectToResponseObject(match))
})
app.get("/players/:playerId/matches",async(request,response)=>{
    const {playerId}=request.params;
    const getPlayerMatchQuery=`
          select *
          From 
            player_match_score
            Natural join match_details
            where player_id=${playerId};`;
    const playersArray=await db.all(getPlayerQuery)
    response.send(playersArray.((eachPlayer)=>convertMatchDetaildDbObjectToResponseObject(eachPlayer)));
});

app.get("/players/:playerId/playerScores",async(request,response)=>{
    const {playerId}=request.params;
    const getPlayerMatchesQuery=`
          select 
          player_id as PlayerId,
          player_name as playerName,
          sum(score) as totalScore,
          sum(fours) as totalFours,
          sum(sixes) as totalSixes
          From 
            player_match_score
            Natural join match_details
            where player_id=${playerId};`;
    const playersMatchDetails=await db.get(getPlayerMatchesQuery)
    response.send(playerMatchDetails)
});
 
module.exports=app;











