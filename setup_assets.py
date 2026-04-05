import os, shutil

src = r'C:\Users\User\.gemini\antigravity\brain\f0c88fa7-9724-430c-8901-529a4cd9db8c'
dst = r'c:\Users\User\Desktop\SoftTech\portfolio\assets'

os.makedirs(dst, exist_ok=True)

files = [
    ('profile_avatar_1775365732039.png',       'profile.png'),
    ('project_ai_chatbot_1775365747687.png',   'project-ai.png'),
    ('project_ums_1775365770141.png',          'project-ums.png'),
    ('project_docker_1775365786053.png',       'project-docker.png'),
    ('project_rescue_1775365801591.png',       'project-rescue.png'),
]

for s, d in files:
    src_path = os.path.join(src, s)
    dst_path = os.path.join(dst, d)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f'Copied: {d}')
    else:
        print(f'NOT FOUND: {s}')

print('Assets in folder:', os.listdir(dst))
