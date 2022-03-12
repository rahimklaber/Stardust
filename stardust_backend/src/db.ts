import {Depot} from "depot-db"

type Key = {secret: string}

export const keyStore = new Depot<Key>("./databases/keys")

