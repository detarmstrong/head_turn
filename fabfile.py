from fabric.api import local, settings
from fabric.contrib.console import confirm

def make_svgs_center():
    """Go through svgs and set preserAspectratio="xMidYMin"
    """
    local("node scripts/make_centered_svgs.js")

def rename_files():
    print "not done yet"

def make_ids_in_svgs_uniq():
    """Iterate svg files and ensure all ids are unique across
    all other svgs. ONLY RUN ONCE!"""
    local("node images/uniq_ids.js")
