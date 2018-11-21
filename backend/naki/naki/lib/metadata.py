from PIL import Image
import subprocess
def video_params(path):
    # TODO better use ffprobe -show_streams and support audio as well ...
    cmd = ('ffprobe %s 2>&1 | ' % path) + \
            'grep -E "Stream.*Video" -B1 | ' + \
            'sed -e \'s/^.*Stream.*[^0-9]\([0-9]*x[0-9]*\)[^0-9].*$/\\1/\' | ' + \
            'sed -e \'s/^.*Duration:[^0-9]*\([0-9:.]*\),.*$/\\1/\''
    ret = subprocess.check_output(cmd.encode('utf8'), shell=True).decode('utf8').split('\n')
    return ret[0], ret[1]

def load_metadata(path, mime):
    metadata = {}
    if mime.startswith('image/'):
        img = Image.open(path)
        metadata['resolution'] = 'x'.join([str(x) for x in img.size])
    if mime.startswith('video/'):
        try:
            duration, resolution = video_params(path)
            metadata['resolution'] = resolution
            metadata['duration'] = duration
        except Exception as e:
            print('Failed to get video resolution %s'% str(e))
    return metadata

