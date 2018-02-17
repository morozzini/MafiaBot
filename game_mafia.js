module.exports.string_status_GameRunning = "Игра запущена";
module.exports.string_status_GameStopped = "Игра не запущена";

module.exports.string_status_Header_GR = "В игре:";
module.exports.string_status_Header_GS = "Роли:";

module.exports.string_status_Channel    = "Канал";
module.exports.string_status_Master     = "Ведущий";
module.exports.string_status_Players    = "Игроки";
module.exports.string_status_Spectators = "Слушают";
module.exports.string_status_Civil      = "Мирный";
module.exports.string_status_Mafia      = "Мафия";
module.exports.string_status_Commissar  = "Комиссар";
module.exports.string_status_Doctor     = "Доктор";
module.exports.string_status_Prostitute = "Проститутка";
module.exports.string_status_Maniac     = "Маньяк";
module.exports.string_status_No         = "Нет";

Array.prototype.shuffle = function( b ) {
    let i = this.length, j, t;
    while( i )
    {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }

    return this;
};

module.exports.main = {
    VoiceChannel: null,
    Master: null,
    Players: null,
    Spectators: null,
    Running: false,
    Init: false
}

module.exports.roles = {
    numMafia : 2,
    numCommissar : 1,
    numDoctor : 1,
    numProstitute : 1,
    numManiac : 1,
    Mafia: null,
    Commissar: null,
    eDoctor: null,
    Prostitute: null,
    Maniac: null
}

module.exports.ClearMain = () => {
    this.main.VoiceChannel  = null;
    this.main.Master        = null;
    if(this.main.Players)
        this.main.Players.clear();
    this.main.Players       = null;
    if(this.main.Spectators)
        this.main.Spectators.clear();
    this.main.Spectators    = null;
    this.main.Running       = false;
    this.main.Init          = false;
}

module.exports.ClearRoles = (full = false) => {
    if(full){
        this.roles.numMafia      = 2;
        this.roles.numCommissar  = 1;
        this.roles.numDoctor     = 1;
        this.roles.numProstitute = 1;
        this.roles.numManiac     = 1;
    }

    if(this.roles.Mafia)
        this.roles.Mafia.clear();
    this.roles.Mafia         = null;
    this.roles.Commissar     = null;
    this.roles.eDoctor       = null;
    this.roles.Prostitute    = null;
    this.roles.Maniac        = null;
}

module.exports.Clear = () => {
    this.ClearMain();
    this.ClearRoles();
}

module.exports.GetGameStatusMain = () => {
    let StrStatus='';

    StrStatus+="```Markdown\n"
    StrStatus+= `# ${(this.main.Running)?this.string_status_GameRunning:this.string_status_GameStopped}\n`;

    StrStatus+=`${this.string_status_Channel}: ${(this.main.VoiceChannel)?this.main.VoiceChannel.name:this.string_status_No}\n`;
    StrStatus+=`${this.string_status_Master}: ${(this.main.Master)?this.main.Master.displayName:this.string_status_No}\n`;

    if(this.main.Players){
        StrStatus+=`${this.string_status_Players} [${this.main.Players.size}]: `;
        for(let [key,value] of this.main.Players){
            StrStatus+=`[${value.displayName}]`
        }
        StrStatus+=`\n`;
    }
    else{
        StrStatus+=`${this.string_status_Players}: ${this.string_status_No}\n`;
    }

    if(this.main.Spectators){
        StrStatus+=`${this.string_status_Spectators} [${this.main.Spectators.size}]: `;
        for(let [key,value] of this.main.Spectators){
            StrStatus+=`[${value.displayName}]`
        }
        StrStatus+=`\n`;
    }
    else{
        StrStatus+=`${this.string_status_Spectators}: ${this.string_status_No}\n`;
    }
    StrStatus+="```";
    return StrStatus;
}

module.exports.GetGameStatusRoles = (ShowNames = false) => {
    let StrRoles='';

    StrRoles+="```Markdown\n"
    
    if(this.main.Running){
        StrRoles+=`# ${this.string_status_Header_GR}\n`;
        if(ShowNames){
            if(this.roles.Mafia.size > 0){
                StrRoles += `${this.string_status_Mafia} [${this.roles.Mafia.size}]: `;
                for(let [key,value] of this.roles.Mafia){
                    StrRoles+=`[${value.displayName}]`
                }
                StrRoles+=`\n`;
            }
            if(this.roles.Commissar)
                StrRoles += `${this.string_status_Commissar}: ${this.roles.Commissar.displayName}\n`;
            if(this.roles.Doctor)
                StrRoles += `${this.string_status_Doctor}: ${this.roles.Doctor.displayName}\n`;
            if(this.roles.Prostitute)
                StrRoles += `${this.string_status_Prostitute}: ${this.roles.Prostitute.displayName}\n`;
            if(this.roles.Maniac)
                StrRoles += `${this.string_status_Maniac}: ${this.roles.Maniac.displayName}\n`;
        }
        else{
            if(this.roles.Mafia.size > 0)
                StrRoles += `${this.string_status_Mafia} ${this.roles.Mafia.size}\n`;
            if(this.roles.Commissar)
                StrRoles += `${this.string_status_Commissar}\n`;
            if(this.roles.Doctor)
                StrRoles += `${this.string_status_Doctor}\n`;
            if(this.roles.Prostitute)
                StrRoles += `${this.string_status_Prostitute}\n`;
            if(this.roles.Maniac)
                StrRoles += `${this.string_status_Maniac}\n`;
        }
    }
    else{
        StrRoles+=`# ${this.string_status_Header_GS}\n`
        if(this.roles.numMafia > 0)
            StrRoles += `${this.string_status_Mafia} ${this.roles.numMafia}\n`;
        if(this.roles.numCommissar > 0)
            StrRoles += `${this.string_status_Commissar}\n`;
        if(this.roles.numDoctor > 0)
            StrRoles += `${this.string_status_Doctor}\n`;
        if(this.roles.numProstitute > 0)
            StrRoles += `${this.string_status_Prostitute}\n`;
        if(this.roles.numManiac > 0)
            StrRoles += `${this.string_status_Maniac}\n`;
    }
    StrRoles+="```";

    return StrRoles;
}

module.exports.GetPlayerRole = inID => {

    if(inID && this.main.Running){
        if(this.roles.Mafia){
            if(this.roles.Mafia.has(inID)){
                return this.string_status_Mafia;
            }
        }
        
        if(this.roles.Commissar){
            if(this.roles.Commissar.id == inID){
                return this.string_status_Commissar;
            }
        }

        if(this.roles.Doctor){
            if(this.roles.Doctor.id == inID){
                return this.string_status_Doctor;
            }
        }

        if(this.roles.Prostitute){
            if(this.roles.Prostitute.id == inID){
                return this.string_status_Prostitute;
            }
        }

        if(this.roles.Maniac){
            if(this.roles.Maniac.id == inID){
                return this.string_status_Maniac;
            }
        }
        
        return this.string_status_Civil;
        
    }
    else{
        return this.string_status_No;
    }

}

module.exports.CalcRoles = () => {
    if(this.main.Init && !this.main.Running){
        if(this.main.Players.size > 0){
            this.roles.numMafia      = 2;
            this.roles.numCommissar  = 1;
            this.roles.numDoctor     = 1;
            this.roles.numProstitute = 1;
            this.roles.numManiac     = 1;
        }
    }
    else{
        //По умолчанию
        this.roles.numMafia      = 2;
        this.roles.numCommissar  = 1;
        this.roles.numDoctor     = 1;
        this.roles.numProstitute = 1;
        this.roles.numManiac     = 1;
    }
}

module.exports.InitRoles = () => {
    if(this.main.Init){
        TempNumMafia      = this.roles.numMafia;
        TempNumCommissar  = this.roles.numCommissar;
        TempNumDoctor     = this.roles.numDoctor;
        TempNumProstitute = this.roles.numProstitute;
        TempNumManiac     = this.roles.numManiac;

        let numRoles =  TempNumMafia +
                        TempNumCommissar +
                        TempNumDoctor +
                        TempNumProstitute +
                        TempNumManiac;
        
        if(this.main.Players.size < numRoles){
            return false;
        }

        this.ClearRoles();
        this.roles.Mafia = new Map();

        //Распределяем роли
        let PlayersID = Array.from(this.main.Players.keys()).shuffle();

        while(numRoles > 0){
            let randNum = Math.floor(Math.random() * PlayersID.length);
            let randID = PlayersID[randNum];
            
            PlayersID.splice(randNum,1);
            numRoles--;

            if(TempNumMafia > 0){
                TempNumMafia--;
                this.roles.Mafia.set(randID,this.main.Players.get(randID));
            }
            else if(TempNumCommissar > 0){
                TempNumCommissar--;
                this.roles.Commissar = this.main.Players.get(randID);
            }
            else if(TempNumDoctor > 0){
                TempNumDoctor--;
                this.roles.Doctor = this.main.Players.get(randID);
            }
            else if(TempNumProstitute > 0){
                TempNumProstitute--;
                this.roles.Prostitute = this.main.Players.get(randID);
            }
            else if(TempNumManiac > 0){
                TempNumManiac--;
                this.roles.Maniac = this.main.Players.get(randID);
            }
        }

        return true;
    }
    else{
        return false;
    }
}

module.exports.MoveToSpectators = (inID, ShowRole=false) =>{
    if(inID){
        if(Array.isArray(inID)){
            let move = false;
            let role;
            for (let i = 0; i < inID.length; i++){
                if(this.main.Players.has(inID[i])){
                    this.main.Spectators.set(inID[i],this.main.Players.get(inID[i]));
                    this.main.Players.delete(inID[i]);
                    move = true;
                }
            }
            if(move)
                return this.string_status_Spectators;
        }
        else{
            if(this.main.Players.has(inID)){
                this.main.Spectators.set(inID,this.main.Players.get(inID));
                this.main.Players.delete(inID);
                return this.string_status_Spectators;
            }
        }
    }
    
    return null;
}
module.exports.MoveToPlayers = (inID) =>{
    if(inID){
        if(Array.isArray(inID)){
            let move = false;
            for (let i = 0; i < inID.length; i++){
                if(this.main.Spectators.has(inID[i])){
                    this.main.Players.set(inID[i],this.main.Spectators.get(inID[i]));
                    this.main.Spectators.delete(inID[i]);
                    move = true;
                }
            }
            if(move)
                return this.string_status_Players;
        }
        else{
            if(this.main.Spectators.has(inID)){
                this.main.Players.set(inID,this.main.Spectators.get(inID));
                this.main.Spectators.delete(inID);
                return this.string_status_Spectators;
            }
        }
    }
    
    return null;
}
module.exports.RemoveRole = (inID) => {
    if(inID && this.main.Running){
        

        if(this.roles.Mafia){
            if(this.roles.Mafia.has(inID[0])){
                this.roles.Mafia.delete(inID[0]);
                if(this.roles.Mafia.size == 0){
                    this.roles.Mafia = null;
                }
                return this.string_status_Mafia;
            }
        }
        
        if(this.roles.Commissar){
            if(this.roles.Commissar.id == inID[0]){
                this.roles.Commissar = null;
                return this.string_status_Commissar;
            }
        }

        if(this.roles.Doctor){
            if(this.roles.Doctor.id == inID[0]){
                this.roles.Doctor = null;
                return this.string_status_Doctor;
            }
        }

        if(this.roles.Prostitute){
            if(this.roles.Prostitute.id == inID[0]){
                this.roles.Prostitute = null;
                return this.string_status_Prostitute;
            }
        }

        if(this.roles.Maniac){
            if(this.roles.Maniac.id == inID[0]){
                this.roles.Maniac = null;
                return this.string_status_Maniac;
            }
        }
        
        if(this.main.Players.has(inID[0]))
            return this.string_status_Civil;
    }

    return null;
}

module.exports.AddRoleMafia = () => {
    if(this.main.Init && !this.main.Running && this.roles.numMafia < 5){
        this.roles.numMafia++;
        return `${this.string_status_Mafia}`;
    }
    else{
        return null;
    }
}
module.exports.SubRoleMafia = () => {
    if(this.main.Init && !this.main.Running && this.roles.numMafia > 1){
        this.roles.numMafia--;
        return `${this.string_status_Mafia}`;
    }
    else{
        return null;
    }
}
module.exports.AddRoleCommissar = () => {
    if(this.main.Init && !this.main.Running && this.roles.numCommissar == 0){
        this.roles.numCommissar++;
        return `${this.string_status_Commissar}`;
    }
    else{
        return null;
    }
}
module.exports.SubRoleCommissar = () => {
    if(this.main.Init && !this.main.Running && this.roles.numCommissar == 1){
        this.roles.numCommissar--;
        return `${this.string_status_Commissar}`;
    }
    else{
        return null;
    }
}
module.exports.AddRoleDoctor = () => {
    if(this.main.Init && !this.main.Running && this.roles.numDoctor == 0){
        this.roles.numDoctor++;
        return `${this.string_status_Doctor}`;
    }
    else{
        return null;
    }
}
module.exports.SubRoleDoctor = () => {
    if(this.main.Init && !this.main.Running && this.roles.numDoctor == 1){
        this.roles.numDoctor--;
        return `${this.string_status_Doctor}`;
    }
    else{
        return null;
    }
}
module.exports.AddRoleProstitute = () => {
    if(this.main.Init && !this.main.Running && this.roles.numProstitute == 0){
        this.roles.numProstitute++;
        return `${this.string_status_Prostitute}`;
    }
    else{
        return null;
    }
}
module.exports.SubRoleProstitute = () => {
    if(this.main.Init && !this.main.Running && this.roles.numProstitute == 1){
        this.roles.numProstitute--;
        return `${this.string_status_Prostitute}`;
    }
    else{
        return null;
    }
}
module.exports.AddRoleManiac = () => {
    if(this.main.Init && !this.main.Running && this.roles.numManiac == 0){
        this.roles.numManiac++;
        return `${this.string_status_Maniac}`;
    }
    else{
        return null;
    }
}
module.exports.SubRoleManiac = () => {
    if(this.main.Init && !this.main.Running && this.roles.numManiac == 1){
        this.roles.numManiac--;
        return `${this.string_status_Maniac}`;
    }
    else{
        return null;
    }
}