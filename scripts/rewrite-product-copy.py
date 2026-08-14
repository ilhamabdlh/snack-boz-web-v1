"""One-off copy pass over data/products.json.

Rewrites descriptions so they stop echoing the product name (it is already
rendered above them) and fills the placeholder ingredient strings.
"""

import json
from pathlib import Path

DESCRIPTIONS = {
    "Bakpao Isi Coklat": "Adonan kukus yang empuk dengan cokelat meleleh di tengahnya. Tidak berminyak, jadi aman untuk tamu anak-anak.",
    "Bakwan Udang": "Digoreng renyah dengan potongan udang di dalamnya. Paling enak dimakan tidak lama setelah sampai.",
    "Bolu Gulung Pelangi": "Gulungan warna-warni dengan selai tipis di tengah. Sering diambil untuk acara ulang tahun anak.",
    "Bolu Karamel": "Warnanya cokelat pekat dengan aroma gula bakar. Dipotong kecil supaya gampang dibagi.",
    "Bolu Kukus Coklat": "Dikukus, bukan dipanggang, jadi teksturnya lembap dan tidak seret di tenggorokan.",
    "Bolu Kukus Gula Aren": "Manisnya datang dari gula aren, jadi terasa lebih bulat dan tidak menyengat.",
    "Bolu Kukus Strawbery": "Wangi stroberi dengan warna merah muda. Berguna untuk menyegarkan isi box yang kebanyakan gurih.",
    "Bolu Pelangi": "Lapisan warnanya tegas dan rapi waktu dipotong. Pilihan aman untuk acara anak.",
    "Bolu Pisang": "Pakai pisang matang, jadi wanginya keluar dan teksturnya lembap. Tidak cepat kering.",
    "Bolu Tape": "Tape singkongnya masih terasa asam manis di belakang lidah. Rasa lama yang biasanya dicari tamu senior.",
    "Cantik Manis": "Kenyal dari sagu mutiara dengan santan yang gurih. Ukurannya kecil, tidak bikin kenyang duluan.",
    "Dadar Gulung": "Kulit pandan tipis berisi kelapa parut dan gula aren. Salah satu yang paling sering dipesan di sini.",
    "Donat Gula Halus": "Empuk dan ditabur gula halus. Menu paling aman kalau selera tamunya bermacam-macam.",
    "Gabin Tape": "Biskuit gabin yang diisi tape lalu digoreng. Kriuk di luar, lembut di dalam.",
    "Ketan Serundeng": "Ketan pulen dengan serundeng kelapa yang gurih. Cukup mengenyangkan untuk rapat pagi.",
    "Kroket Isi Daging": "Kentang halus berisi daging cincang, dibalut tepung roti sebelum digoreng.",
    "Kue Angku": "Cetakan berbentuk ikan dengan isi kacang hijau. Sering dipakai untuk syukuran.",
    "Kue Bugis Pandan": "Ketan kenyal berisi kelapa parut, harum pandan. Manisnya tidak berlebihan.",
    "Kue Lapis": "Lapisannya tipis-tipis dan kenyal, enak dimakan sambil dikelupas satu per satu.",
    "Kue Lapis Legit": "Berlapis-lapis dengan aroma rempah dan mentega. Dipotong kecil karena rasanya padat.",
    "Kue Lumpur": "Adonan kentang dan santan yang lembut seperti puding, dengan kismis di atasnya.",
    "Kue Lumpur Pandan": "Versi pandan dari kue lumpur. Wanginya lebih kuat, teksturnya sama lembutnya.",
    "Kue Mochi": "Kulit ketan kenyal berisi kacang, ditabur tepung tipis. Kecil dan gampang dipegang.",
    "Kue Soes": "Kulit berongga yang ringan dengan vla susu di dalamnya. Tidak bikin eneg.",
    "Kue Tampah Keluarga": "Beragam kue basah manis dan gurih, ditata dalam satu tampah anyaman. Langsung bisa ditaruh di meja tanpa perlu ditata ulang.",
    "Lapis Legit Pandan": "Lapis legit dengan pandan menggantikan rempah. Wanginya lebih segar dan warnanya hijau.",
    "Lemper Isi Ayam": "Ketan gurih berisi ayam suwir berbumbu, dibungkus daun pisang. Favorit untuk rapat pagi karena mengenyangkan.",
    "Lontong Isi Ayam": "Lontong padat dengan isian ayam berbumbu. Ambil ini kalau tamunya butuh yang lebih mengenyangkan.",
    "Lontong Isi Sayuran": "Isinya sayur tumis, jadi lebih ringan. Aman untuk tamu yang tidak makan daging.",
    "Lumpia Goreng": "Kulit tipis berisi rebung dan sayur, digoreng sampai renyah. Gurihnya menyeimbangkan kue manis.",
    "Muffin Chocolate": "Padat dan tidak gampang hancur. Aman kalau boxnya masih harus dibawa pulang tamu.",
    "Nagasari": "Pisang yang dibungkus adonan tepung beras lalu dikukus dalam daun. Wangi daunnya ikut masuk.",
    "Nasi Bakar Ayam Suwir": "Nasi berbumbu dengan ayam suwir, dibakar dalam daun pisang. Untuk acara yang butuh makanan berat.",
    "Nasi Bakar Cumi": "Cumi berbumbu dengan rasa yang lebih tajam. Untuk tamu yang tidak takut bumbu kuat.",
    "Nasi Bakar Teri Pete": "Teri, pete, dan sambal dalam satu bungkus daun. Wanginya kuat, sebaiknya tidak disatukan dengan kue manis.",
    "Nastar Nanas": "Selai nanas dimasak sendiri sampai pekat, kulitnya rapuh. Dikemas dalam toples untuk hari raya atau hampers.",
    "Onde-Onde": "Bola ketan bertabur wijen dengan isi kacang hijau. Digoreng, jadi luarnya renyah.",
    "Pastel": "Kulit berlipat dengan isian sayur dan bihun. Salah satu isi snack box yang paling klasik.",
    "Pie Buah": "Kulit renyah dengan vla dan potongan buah segar di atasnya. Menaikkan tampilan box tanpa banyak tambahan biaya.",
    "Pie Coklat": "Cokelat pekat dalam kulit pie yang rapuh. Manisnya sedang, tidak berat untuk rapat.",
    "Pie Keranjang": "Kecil, padat, dan tidak gampang penyok. Pilihan aman untuk hampers yang harus dikirim.",
    "Pie Susu": "Custard susu yang lembut dengan kulit tipis. Manisnya ringan.",
    "Putri Ayu": "Bolu pandan kukus dengan kelapa parut di atasnya. Bentuknya rapi, enak dilihat waktu ditata di tampah.",
    "Risol Mayones": "Isian mayones dan telur yang creamy dalam balutan tepung roti. Termasuk yang paling cepat habis.",
    "Risol Rogut": "Ragout ayam dan sayur dalam kulit risoles yang digoreng. Gurihnya mengimbangi kue manis di box.",
    "Risol Sayur": "Isian wortel dan kentang tumis, lebih ringan daripada yang mayones.",
    "Risoles Mayones": "Ukurannya lebih besar dengan isian mayones yang penuh. Cukup mengenyangkan sendiri.",
    "Serabi Solo": "Dipanggang di wajan kecil sampai pinggirannya tipis dan renyah, tengahnya lembut oleh santan.",
    "Snack Box Rapat Pagi": "Dua macam kue basah dan satu air mineral dalam satu box. Tinggal dibagikan di meja rapat.",
    "Sosis Solo": "Dadar tipis berisi ayam berbumbu, digoreng sebentar. Kecil dan gampang dimakan sambil berdiri.",
    "Talam Pandan": "Dua lapis: pandan di bawah, santan gurih di atas. Potongannya kecil dan rapi.",
    "Talam Ubi": "Lapisan ubi oranye dengan santan di atasnya. Manisnya datang dari ubinya sendiri.",
    "Wajik": "Ketan yang dimasak lama dengan gula merah sampai legit. Dibungkus daun dan tahan lebih lama dari kue basah lain.",
    "Wingko Babat": "Kelapa parut dan ketan dipanggang sampai pinggirannya kecokelatan. Kenyal dan gurih.",
}

PLACEHOLDER = "Bahan pilihan dapur Snack Boz."

INGREDIENTS = {
    "Kue Bugis Pandan": "Tepung ketan, kelapa parut, pandan, gula.",
    "Kue Lapis": "Tepung beras, tepung sagu, santan, gula.",
    "Kue Lumpur": "Kentang, santan, telur, kismis.",
    "Kue Lumpur Pandan": "Kentang, santan, telur, pandan.",
    "Kue Mochi": "Tepung ketan, kacang tanah, gula.",
    "Kue Soes": "Tepung, telur, mentega, vla susu.",
    "Lapis Legit Pandan": "Telur, mentega, tepung, pandan.",
    "Lontong Isi Ayam": "Beras, daun pisang, ayam, bumbu.",
    "Lontong Isi Sayuran": "Beras, daun pisang, wortel, kol, bumbu.",
    "Lumpia Goreng": "Kulit lumpia, rebung, wortel, bihun.",
    "Muffin Chocolate": "Tepung, coklat, telur, mentega.",
    "Nagasari": "Tepung beras, santan, pisang, daun pisang.",
    "Nasi Bakar Cumi": "Nasi, cumi, bumbu bakar, daun pisang.",
    "Nasi Bakar Teri Pete": "Nasi, teri, pete, sambal, daun pisang.",
    "Onde-Onde": "Tepung ketan, kacang hijau, wijen, gula.",
    "Pastel": "Tepung, wortel, kentang, bihun, telur.",
    "Pie Buah": "Tepung, mentega, vla susu, buah segar.",
    "Pie Coklat": "Tepung, mentega, coklat, krim.",
    "Pie Keranjang": "Tepung, mentega, telur, gula.",
    "Pie Susu": "Tepung, mentega, susu, telur.",
    "Putri Ayu": "Tepung, pandan, santan, kelapa parut.",
    "Risol Mayones": "Tepung, telur, mayones, tepung roti.",
    "Risol Sayur": "Tepung, wortel, kentang, tepung roti.",
    "Risoles Mayones": "Tepung, telur, mayones, tepung roti.",
    "Serabi Solo": "Tepung beras, santan, gula.",
    "Sosis Solo": "Telur, ayam cincang, tepung, bumbu.",
    "Talam Pandan": "Tepung beras, santan, pandan, gula.",
    "Talam Ubi": "Ubi, tepung beras, santan, gula.",
    "Wajik": "Beras ketan, gula merah, santan, pandan.",
    "Wingko Babat": "Kelapa parut, tepung ketan, gula, telur.",
}

path = Path("data/products.json")
items = json.loads(path.read_text())

missing_desc, missing_ing = [], []
for item in items:
    name = item["name"]
    if name in DESCRIPTIONS:
        item["description"] = DESCRIPTIONS[name]
    else:
        missing_desc.append(name)

    if item["ingredients"] == PLACEHOLDER:
        if name in INGREDIENTS:
            item["ingredients"] = INGREDIENTS[name]
        else:
            missing_ing.append(name)

path.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")

print(f"deskripsi diperbarui: {len(items) - len(missing_desc)}/{len(items)}")
if missing_desc:
    print("deskripsi belum ditulis:", missing_desc)
if missing_ing:
    print("bahan masih placeholder:", missing_ing)
