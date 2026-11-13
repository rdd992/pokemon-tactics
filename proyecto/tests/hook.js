window.__T={get units(){return units},set units(v){units=v},unit,statCalc,damage,applyEffect,moveDB,base,chart,reachable,levelUp,calculateCapture,stageFactor,learnsets,evolutionRules,get stageCleared(){return stageCleared},startTemporaryEffect,drawCinematicFrame,effect,itemIc,rodLevel,previewAnimation,movesForLevel,CAMPAIGN,STAGE_ORDER,showCampaign,beginCampaignEncounter,showModal,ITEM_SPR,grassPowderImmune,get round(){return round}};
window.__T.openMoves=(i)=>{selected=units.find(u=>u.side==='player');phase='player';locked=false;actionMenu='moves';menuIndex=i||0;renderBattleMenu();updateUI&&0};
window.__T.setMenu=(i)=>{menuIndex=i;renderMenuHighlight()};
window.__T.makeSave=()=>makeSave();window.__T.validateSave=d=>validateSave(d);
window.__T.openActions=()=>{selected=units.find(u=>u.side==='player');phase='player';locked=false;actionMenu='actions';menuIndex=0;renderBattleMenu()};
window.__T.R3=()=>R3;
window.__T.enterCamp=()=>{phase='win';currentEncounter=null;enterCamp()};
window.__T.beginEnemy=()=>beginEnemy();window.__T.phase=()=>phase;
window.__T.openLunarPrompt=()=>openLunarPrompt();window.__T.setLevels=n=>{for(const u of units)if(u.side==='player')u.level=n};
