import { requiredEnv } from "../utils/env";

export const Credential = {

    Btm: {
        Username: requiredEnv('BTM_USERNAME'),
        Password: requiredEnv('BTM_PASSWORD')
    },

    Daytrans: {
        Username: requiredEnv('DAYTRANS_USERNAME'),
        Password: requiredEnv('DAYTRANS_PASSWORD')
    },

    Baraya: {        
        Username: requiredEnv('BARAYA_USERNAME'),
        Password: requiredEnv('BARAYA_PASSWORD')
    },

    Aragon: {
        Username: requiredEnv('ARAGON_USERNAME'),
        Password: requiredEnv('ARAGON_PASSWORD')
    },

    Jackal: {
        Username: requiredEnv('JACKAL_USERNAME'),
        Password: requiredEnv('JACKAL_PASSWORD')
    }

}