# An action to generate semver and create release based on generated version

This action finds the latest Github release semantic version number and generates a new version. This action optionally can create a new release and upload release assets based on new the version number.


## Action Parameters
```YAML
- name: 'Get json subbed'
  id: subbed
  uses: "snsinahub-org/semver@v3.0.0"
  with:
  
    # List of variables
    
    # Required: false
    # Default: ${{ github.repository }}
    repo: ${{ github.repository }}
    
    # Required: false
    # Default: ${{ github.token }}
    token: ${{ github.token }}
    
    # Description: semver is incrementing based on type value
    # Required: true
    # Default: 'PATCH'
    # Accepted values: major, minor, patch
    type: 'PATCH'

    # Description: semver action exits if type is not provided.
    # Required: true
    # Default: 'no'
    # Accepted values: yes, no
    exit-on-missing-type: 'no'
    
    # Description:  You can add a prefix to semver e.g. v1.0.0 
    # Required: false
    # Default: ''
    prefix: ''
    
    # Description: if create-release enabled, you can add one or multiple files
    # Required: false
    # Default: ''
    files: 
    
    # Description: make a release pre-release if the value is yes
    # Required: false
    # Default: 'no'
    # Accepted values: no, yes
    prerelease:
    
    # Description: This will be release body, you can add changelog or additional description to your release
    # Required: false
    # The changelog is automatically added as a release note
    # The body value will be appended to changelog
    # Default: ''
    body: 
    
    
    # Description: Actions will create a new release if the value sets to yes
    # Required: false
    # Default: 'yes'
    # Accepted values: no, yes
    create-release: 
    
    # Description: Specify which branch must be used to create a new release. Default value is repository's branch e.g. main or master
    # Required: false
    # Default: 'default-branch'
    branch: 
```

## Output
```YAML
  # Genereated version based on type 
  version: 
```

## Examples

## How to generate new version
Let's say current version is `v1.0.0` and you can set `type` equal to one of these values 

- **MAJOR**: It is a major change to your software which may not be compatible with older releases. The new version will be `v3.0.0` 
- **MINOR**: The change is smaller and adds new features to an existing project but still compatible with the current version. The new version is `v1.1.0`
- **PATCH**: There is a bug fix without introducing new features. The new version is `v1.0.1`


### Action sample 

```YAML
    - name: checkout
        uses: actions/checkout@v3
    - name: 'Get semver based on pr label'
        id: semver
        uses: "snsinahub-org/semver@v3.0.0"
        with:
          type: 'MAJOR'
          prefix: 'v'
          body: 'Release body text... '
          create-release: 'yes'
          files: |
            Dockerfile
            action.yml
            code-coverage-report.zip
      - name: 'print version'        
        run: |
         echo ${{ steps.semver.outputs.version }}
```
