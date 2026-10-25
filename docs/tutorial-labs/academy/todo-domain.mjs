// Teaching domain only: in-memory synthetic data, no network, database or production authentication.
export function createStore(){
 const rows=new Map();let next=1;
 return {
  create(owner,title){if(typeof owner!=='string'||!owner.trim())throw Error('IDENTITY_REQUIRED');if(typeof title!=='string'||!title.trim()||title.trim().length>120)throw Error('INVALID_TITLE');const row={id:String(next++),owner,title:title.trim(),done:false};rows.set(row.id,row);return {...row};},
  read(owner,id){const row=rows.get(id);if(!row||row.owner!==owner)throw Error('NOT_FOUND_OR_FORBIDDEN');return {...row};},
  complete(owner,id){const row=rows.get(id);if(!row||row.owner!==owner)throw Error('NOT_FOUND_OR_FORBIDDEN');row.done=true;return {...row};},
  list(owner){return [...rows.values()].filter(row=>row.owner===owner).map(row=>({...row}));}
 };
}
