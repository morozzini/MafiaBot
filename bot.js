const DEBUG = true;
const BOTVERSION = "Mafia Bot v.0.0.1a";

const config = require('./config.json');
const Game = require('./game_mafia.js');

const Discord = require('discord.js');
const client = new Discord.Client();

const cmd_PREFIX = "!";

const cmd_INIT        = `init`;
const cmd_END         = `end`;
const cmd_STATUSMAIN  = `statusmain`;
const cmd_STATUSROLES = `statusroles`;
const cmd_START       = `start`;
const cmd_STOP        = `stop`;
const cmd_NIGHT       = `night`;
const cmd_DAY         = `day`;
const cmd_ADD         = `add`;
const cmd_SUB         = `sub`;
const cmd_MAFIA       = `mafia`
const cmd_COMMISSAR   = `commissar`;
const cmd_DOCTOR      = `doctor`;
const cmd_PROSTITUTE  = `prostitute`;
const cmd_MANIAC      = `maniac`;

const cmd_synonym_INIT        = `инит|начать|яведущий|ведущий|ямастер`;
const cmd_synonym_END         = `конец`;
const cmd_synonym_STATUSMAIN  = `status|stat|статус|config|конфиг`;
const cmd_synonym_STATUSROLES = `roles|role|роли`;
const cmd_synonym_START       = `старт|игра|game`;
const cmd_synonym_STOP        = `стоп|clear|очистить|сбросить`;
const cmd_synonym_NIGHT       = `ночь|тихо|молчать|off`;
const cmd_synonym_DAY         = `morning|morn|утро|день|звук|on`;
const cmd_synonym_ADD         = `\\++|добавить|игроки`;
const cmd_synonym_SUB         = `-+|dec|убрать|зрители|kill|убить`;
const cmd_synonym_MAFIA       = `maf|мафия|маф`
const cmd_synonym_COMMISSAR   = `com|комисcар|ком`;
const cmd_synonym_DOCTOR      = `doc|доктор|док`;
const cmd_synonym_PROSTITUTE  = `проститутка|девочка|дев|girl|герла`;
const cmd_synonym_MANIAC      = `маньяк|ман|man`;


const answer_OK = `OK|done|окай|сделано|принял|пип бип|бип пип|бик|хороший выбор|уже|готово|дзинь|:ok_hand:|:thumbsup:`;
const answer_NO = `NO|none|нет|неа|не сделано|не принял|о-оу|:thumbsdown:`;

const answer_ERR_NOBOTINIT      = `Игра не инициализирована. Отправь \`${cmd_PREFIX}${cmd_INIT}\` чтобы настроить игру.`;
const answer_ERR_BOTINIT        = `Игра уже инициализирована. Отправь \`${cmd_PREFIX}${cmd_END}\` чтобы сбросить настройки.`;
const answer_ERR_NOVOISECHANNEL = `Зайди в войс.`;
const answer_ERR_NOPLAYERS      = `Мало игроков.`;
const answer_ERR_YOUNOTMASTER   = `Ты не ведущий.`;
const answer_ERR_UNKNOWNCMD     = `Неизвестная команда.`;



random_str = (inStr, num) => {
    if(Array.isArray(inStr)){
        if((num >= 0) && (num < inStr.length-1)){
            return inStr[num];
        }
        return inStr[Math.floor(Math.random() * inStr.length)];
    }
    else{
        let spl = inStr.split(`|`);
        
        if(spl.length > 0){
            if((num >= 0) && (num < spl.length-1)){
                return spl[num];
            }
            return spl[Math.floor(Math.random() * spl.length)];
        }
        return inStr;
    }
};
random_OK = (num) => {
    return random_str(answer_OK, num);
};
random_NO = (num) => {
    return random_str(answer_NO, num);
};

function normalizeCommand(inCmd) {
    let command = ``;
    let rePrefix = new RegExp(`(^(<@\\d{18}>\\s?(\\${cmd_PREFIX})?|\\${cmd_PREFIX})|\\s+)`,"g");

    let reInit        = new RegExp(`(${cmd_synonym_INIT})`);
    let reEnd         = new RegExp(`(${cmd_synonym_END})`);
    let reStatusMain  = new RegExp(`(${cmd_synonym_STATUSMAIN})`);
    let reStatusRoles = new RegExp(`(${cmd_synonym_STATUSROLES})`);
    let reStart       = new RegExp(`(${cmd_synonym_START})`);
    let reStop        = new RegExp(`(${cmd_synonym_STOP})`);
    let reNight       = new RegExp(`(${cmd_synonym_NIGHT})`);
    let reDay         = new RegExp(`(${cmd_synonym_DAY})`);
    let reAdd         = new RegExp(`(${cmd_synonym_ADD})`);
    let reSub         = new RegExp(`(${cmd_synonym_SUB})`);
    let reMafia       = new RegExp(`(${cmd_synonym_MAFIA})`);
    let reCommissar   = new RegExp(`(${cmd_synonym_COMMISSAR})`);
    let reDoctor      = new RegExp(`(${cmd_synonym_DOCTOR})`);
    let reProstitute  = new RegExp(`(${cmd_synonym_PROSTITUTE})`);
    let reManiac      = new RegExp(`(${cmd_synonym_MANIAC})`);

    let reInitClear        = new RegExp(`(\\S+(?=${cmd_INIT}))?(${cmd_INIT})(\\S+)?`);
    let reEndClear         = new RegExp(`(\\S+(?=${cmd_END}))?(${cmd_END})(\\S+)?`);
    let reStatusMainClear  = new RegExp(`(\\S+(?=${cmd_STATUSMAIN}))?(${cmd_STATUSMAIN})(\\S+)?`);
    let reStatusRolesClear = new RegExp(`(\\S+(?=${cmd_STATUSROLES}))?(${cmd_STATUSROLES})(\\S+)?`);
    let reStartClear       = new RegExp(`(\\S+(?=${cmd_START}))?(${cmd_START})(\\S+)?`);
    let reStopClear        = new RegExp(`(\\S+(?=${cmd_STOP}))?(${cmd_STOP})(\\S+)?`);
    let reNightClear       = new RegExp(`(\\S+(?=${cmd_NIGHT}))?(${cmd_NIGHT})(\\S+)?`);
    let reDayClear         = new RegExp(`(\\S+(?=${cmd_DAY}))?(${cmd_DAY})(\\S+)?`);

    let reAddMove = new RegExp(`(\\S+(?=${cmd_ADD}))?(${cmd_ADD})(\\S+)?`);
    let reSubMove = new RegExp(`(\\S+(?=${cmd_SUB}))?(${cmd_SUB})(\\S+)?`);

    let normalCmd = inCmd.toLowerCase()
                        .replace(rePrefix,"")
                        .replace(reInit       , cmd_INIT       ).replace(reInitClear       , "$2")
                        .replace(reEnd        , cmd_END        ).replace(reEndClear        , "$2")
                        .replace(reStatusMain , cmd_STATUSMAIN ).replace(reStatusMainClear , "$2")
                        .replace(reStatusRoles, cmd_STATUSROLES).replace(reStatusRolesClear, "$2")
                        .replace(reStart      , cmd_START      ).replace(reStartClear      , "$2")
                        .replace(reStop       , cmd_STOP       ).replace(reStopClear       , "$2")
                        .replace(reNight      , cmd_NIGHT      ).replace(reNightClear      , "$2")
                        .replace(reDay        , cmd_DAY        ).replace(reDayClear        , "$2")
                        .replace(reAdd        , cmd_ADD        ).replace(reAddMove         , "$2 $1$3")
                        .replace(reSub        , cmd_SUB        ).replace(reSubMove         , "$2 $1$3")
                        .replace(reMafia      , cmd_MAFIA      )
                        .replace(reCommissar  , cmd_COMMISSAR  )
                        .replace(reDoctor     , cmd_DOCTOR     )
                        .replace(reProstitute , cmd_PROSTITUTE )
                        .replace(reManiac     , cmd_MANIAC     )
                        .trim();

    return normalCmd;
}

function DEBUGLOG(logstr) {
    if (DEBUG)
        console.log(`${new Date().toISOString().replace(/T/, ` `).replace(/\..+/, '')} ${logstr.replace("\n"," ")}`);
}

client.on('ready', () => {
    let nameguilds = ``;
    for (let [key, value] of client.guilds) {
        nameguilds+=`"${value.name}" `;
    }
    console.log(`${new Date().toISOString().replace(/T/, ` `).replace(/\..+/, '')} I am ready! ${BOTVERSION}. Guilds: ${nameguilds}`);
});

client.on('voiceStateUpdate', function (oldMember, newMember) {
    if(Game.main.Init){
        if(!Game.main.Players.has(newMember.id) && !Game.main.Spectators.has(newMember)){
            Game.main.Spectators.set(newMember.id,newMember);

            if(Game.main.Running){
                newMember.setMute(true);
            }
            // else{
            //     newMember.setMute(false);
            // }
        }
    }
});

client.on('message', message => {
    if (message.author === client.user) return;

    if (message.channel.type === "text") {
        if (message.content.startsWith(`${client.user}`) || (message.content.startsWith(cmd_PREFIX))) {
            //DEBUGLOG(`IN (${message.channel.type})[${message.guild.name}][${message.channel.name}]\$ ${message.author.username}: "${message.content}"`);
            
            let command = normalizeCommand(message.content);
            console.log(`command '${command}'`);
            //cmd_INIT
            if      (command.startsWith(cmd_INIT)){
                if(Game.main.Init){
                    message.channel.send(`${random_NO()}. ${answer_ERR_BOTINIT}`);
                }
                else{
                    Game.Clear();

                    if(message.member.voiceChannel){
                        Game.main.VoiceChannel = message.member.voiceChannel;
                    }
                    else{
                        //DEBUGLOG(`ERROR ${message.author.username} not in voiceChannel`);
                        message.channel.send(`${random_NO()}. ${answer_ERR_NOVOISECHANNEL}`);
                        return;
                    }

                    Game.main.Master = message.member;

                    Game.main.Spectators = new Map();
                    Game.main.Players = new Map();

                    //if(message.member.voiceChannel.members.size > 1){
                        for(let [key,value] of message.member.voiceChannel.members){
                            //if(key != Game.main.Master.id){
                                Game.main.Players.set(key,value);
                            //}
                        }
                    //}
                    if(Game.main.Players.size == 0){
                        Game.Clear();
                        message.channel.send(`${random_NO()}. ${answer_ERR_NOPLAYERS}`);
                        return;
                    }

                    Game.CalcRoles();

                    Game.main.Running = false;
                    Game.main.Init = true;

                    message.channel.send(random_OK() + Game.GetGameStatusMain() + Game.GetGameStatusRoles());
                }
            }
            else if (command.startsWith(cmd_END)){
                
                if(Game.main.Players){
                    Game.main.Players.forEach(value => {
                        value.setMute(false);
                    });
                }
                if(Game.main.Spectators){
                    Game.main.Spectators.forEach(value => {
                        value.setMute(false);
                    });
                }
                if(message.member.voiceChannel.members){
                    message.member.voiceChannel.members.forEach(value => {
                        value.setMute(false);
                    });
                }
                Game.Clear();

                message.channel.send(random_OK());
            }
            else if (command.startsWith(cmd_STATUSMAIN)){
                if(Game.main.Init){
                    message.channel.send(random_OK() + Game.GetGameStatusMain());
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_STATUSROLES)){
                if(Game.main.Init){
                    message.channel.send(random_OK() + Game.GetGameStatusRoles());
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_NIGHT)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){
                        if(Game.main.Players){
                            Game.main.Players.forEach(value => {
                                value.setMute(true);
                            });
                        }
                        if(Game.main.Spectators){
                            Game.main.Spectators.forEach(value => {
                                value.setMute(true);
                            });
                        }
                        // if(message.member.voiceChannel.members){
                        //     message.member.voiceChannel.members.forEach(value => {
                        //         value.setMute(true);
                        //     });
                        // }
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_DAY)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){
                        if(Game.main.Players){
                            Game.main.Players.forEach(value => {
                                value.setMute(false);
                            });
                        }
                        // if(Game.main.Spectators){
                        //     Game.main.Spectators.forEach(value => {
                        //         value.setMute(true);
                        //     });
                        // }
                        // if(message.member.voiceChannel.members){
                        //     message.member.voiceChannel.members.forEach(value => {
                        //         value.setMute(true);
                        //     });
                        // }
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_START)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){
                        Game.InitRoles();
                        Game.main.Running = true;

                        // if(Game.main.Players){
                        //     Game.main.Players.forEach(value => {
                        //         value.setMute(true);
                        //     });
                        // }
                        if(Game.main.Spectators){
                            Game.main.Spectators.forEach(value => {
                                value.setMute(true);
                            });
                        }
                        // if(message.member.voiceChannel.members){
                        //     message.member.voiceChannel.members.forEach(value => {
                        //         value.setMute(true);
                        //     });
                        // }

                        message.channel.send(random_OK() + Game.GetGameStatusRoles(true));
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_STOP)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){
                        Game.ClearRoles();

                        if(Game.main.Players){
                            Game.main.Players.forEach(value => {
                                value.setMute(false);
                            });
                        }
                        if(Game.main.Spectators){
                            Game.main.Spectators.forEach(value => {
                                value.setMute(false);
                            });
                        }
                        if(message.member.voiceChannel.members){
                            message.member.voiceChannel.members.forEach(value => {
                                value.setMute(false);
                            });
                        }
                        message.channel.send(random_OK());
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_ADD)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){

                        if(!Game.main.Running){
                            let inID = command.match(/\d{18}/g);

                            if(inID){
                                let ret = Game.MoveToPlayers(inID);
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.main.Players.size}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_MAFIA)){
                                let ret = Game.AddRoleMafia();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numMafia}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_COMMISSAR)){
                                let ret = Game.AddRoleCommissar();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numCommissar}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_DOCTOR)){
                                let ret = Game.AddRoleDoctor();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numDoctor}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_PROSTITUTE)){
                                let ret = Game.AddRoleProstitute();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numProstitute}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_MANIAC)){
                                let ret = Game.AddRoleManiac();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret}  ${Game.roles.numManiac}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                        }
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else if (command.startsWith(cmd_SUB)){
                if(Game.main.Init){
                    if(message.member.id == Game.main.Master.id){

                        if(!Game.main.Running){
                            let inID = command.match(/\d{18}/g);
                            
                            if(inID){
                                let ret = Game.MoveToSpectators(inID);
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.main.Spectators.size}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_MAFIA)){
                                let ret = Game.SubRoleMafia();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numMafia}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_COMMISSAR)){
                                let ret = Game.SubRoleCommissar();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numCommissar}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_DOCTOR)){
                                let ret = Game.SubRoleDoctor();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numDoctor}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_PROSTITUTE)){
                                let ret = Game.SubRoleProstitute();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numProstitute}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                            else if (command.endsWith(cmd_MANIAC)){
                                let ret = Game.SubRoleManiac();
                                if(ret){
                                    message.channel.send(`${random_OK()}. ${ret} ${Game.roles.numManiac}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                        }
                        else{
                            let inID = command.match(/\d{18}/g);
                            
                            if(inID){
                                let ret = Game.RemoveRole(inID);
                                if(ret){
                                    Game.MoveToSpectators(inID);
                                    message.channel.send(`${random_OK()}. ${ret}`);
                                }
                                else{
                                    message.channel.send(random_NO());
                                }
                            }
                        }
                    }
                    else{
                        message.channel.send(`${random_NO()}. ${answer_ERR_YOUNOTMASTER}.`);
                    }
                }
                else{
                    message.channel.send(`${random_NO()}. ${answer_ERR_NOBOTINIT}`);
                }
            }
            else {
                message.channel.send(`${random_NO()}. ${answer_ERR_UNKNOWNCMD} \`${message.content}\``);
            }

        }
    }
});

client.login(config.token);