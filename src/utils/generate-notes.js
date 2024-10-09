'use strict';


const _ = require('lodash');
const { Octokit } = require("@octokit/rest");


module.exports = class GenerateReleaseNote {

    constructor(token) {
        this.token = token;
        this.ops = {
            auth: this.token
        }
        this.octokit = new Octokit(this.ops);
    }
 
    

    async genNotes(owner, repo, previous_tag_name, tag_name, branch, config_path = '') {
        return await this.octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
            owner: owner,
            repo: repo,
            tag_name: tag_name,
            target_commitish: branch,
            previous_tag_name: previous_tag_name,
            configuration_file_path: config_path
          })
    }
}