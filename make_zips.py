"""Repackage the Cherrystone theme and blocks plugin into WordPress-installable zips.

Why this exists: a previous theme.zip was built with Windows PowerShell 5.1
Compress-Archive, which writes backslash path separators. The ZIP spec requires
forward slashes; on a Linux WordPress host those entries extract as literal files
named e.g. 'assets\\css\\theme.css' instead of a real directory tree, breaking the
theme. Python's zipfile always writes forward slashes, so we use it here.

Layout matches the project's existing working convention: files live at the zip
root (no wrapper folder); WordPress names the installed folder after the zip
basename (cherrystone-theme / cherrystone-blocks).
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))

# (source_dir, output_zip, set_of_top_level_names_to_exclude)
JOBS = [
    (os.path.join(ROOT, "cherrystone-theme"),
     os.path.join(ROOT, "cherrystone-theme.zip"),
     set()),
    (os.path.join(ROOT, "cherrystone-blocks"),
     os.path.join(ROOT, "cherrystone-blocks.zip"),
     {"node_modules", "package-lock.json"}),
]


def build(src_dir, out_zip, excludes):
    count = 0
    if os.path.exists(out_zip):
        os.remove(out_zip)
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as z:
        for dirpath, dirnames, filenames in os.walk(src_dir):
            rel_dir = os.path.relpath(dirpath, src_dir)
            top = rel_dir.split(os.sep)[0] if rel_dir != "." else ""
            if top in excludes:
                dirnames[:] = []
                continue
            # prune excluded dirs at the top level
            dirnames[:] = [d for d in dirnames
                           if not (rel_dir == "." and d in excludes)]
            for fn in filenames:
                if rel_dir == "." and fn in excludes:
                    continue
                abs_path = os.path.join(dirpath, fn)
                arcname = os.path.relpath(abs_path, src_dir).replace(os.sep, "/")
                z.write(abs_path, arcname)
                count += 1
    return count


for src_dir, out_zip, excludes in JOBS:
    n = build(src_dir, out_zip, excludes)
    size = os.path.getsize(out_zip)
    print(f"{os.path.basename(out_zip)}: {n} files, {size:,} bytes")
