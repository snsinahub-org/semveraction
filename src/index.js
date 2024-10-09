const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');
const { graphql } = require("@octokit/graphql");
const getTags = require('./utils/get-tags.js');
const JsonUtils = require('./utils/json-utils.js');
const Release = require('./utils/release.js');
const GenNotes = require('./utils/generate-notes.js');

async function run() {
    // Inputs
    const myToken = core.getInput('token');
    const type = core.getInput('type') == '' ? 'PATCH' : core.getInput('type');
    const prefix = core.getInput('prefix');
    const prerelease = core.getInput('prerelease');
    const body = core.getInput('body');
    const files = core.getInput('files');
    const branch = core.getInput('branch');
    const createRelease = core.getInput('create-release') == 'yes' ? true : false;
    const exitOnMissingType = core.getInput('exit-on-missing-type') == 'yes' ? true : false;




    // class initializations
    const release = new Release(myToken);    
    
    const repoFull = core.getInput('repo').split('/');
    const tags = new getTags();


    let owner = repoFull[0];
    let repo = repoFull[1]
    
    const { repository } = await tags.getAllTags(owner, repo, myToken);
    
    let tagsObj = tags.getTags(repository);
    const jsonUtils = new JsonUtils(tagsObj); 

    if(prefix == '') {
        jsonUtils.filterNoPrefix()
    } else {
        jsonUtils.filterByPrefix(prefix);
    } 

    let newVersion = '';
    let latestVersion =  ''
    
    if(jsonUtils.jsonObj.length > 0 && !exitOnMissingType){
        latestVersion = jsonUtils.firstItem('tagName');
        newVersion = jsonUtils.upgradeVersion(latestVersion, type, prefix);


    } else {
        newVersion = `${prefix}1.0.0`;
    }

    console.log("NEW VERSION: ", newVersion);

    const notes = new GenNotes(myToken);
    if(createRelease && !exitOnMissingType) {        
        const releaseNote = await notes.genNotes(owner, repo, latestVersion, newVersion, branch, '');
        console.log("RELEASE NOTES: ", JSON.stringify(releaseNote.data.body))
        let newRelease = await release.createRelease(owner, repo, newVersion, branch, prerelease, `${releaseNote.data.body}\n\n${body}`);
        release.releaseData(newRelease);    
        if(files != '') {
            let upload = await release.uploadFiles(owner, repo, files);
        }
    }


    fs.appendFileSync(process.env.GITHUB_OUTPUT, "version=" + newVersion);
    const octokit = github.getOctokit(myToken);
}

run();