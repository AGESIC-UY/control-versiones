databases = ['buildingBlocks']

for (let i = databases.length - 1; i >= 0; i--) {
    db = db.getSiblingDB(databases[i])

    db.createUser({
        user: "agesic",
        pwd: "agesic-control-versiones",
        roles: [{
            role: "readWrite",
            db: databases[i]
        }]
    })
}