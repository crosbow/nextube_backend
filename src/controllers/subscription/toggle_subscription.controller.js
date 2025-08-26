import { asyncHandler } from "../../utils/asyncHandler";

const toggleSubscription = asyncHandler(async (req, res) => {
  /*
     -> Get channel id from request params  
     -> find channel and and validate 
     -> check if already subscribed, 
        > if yes, remove subscription doc from DB 
        > if no, create new subscription 
     -> return toggle subscribe response
    */
});

export { toggleSubscription };
