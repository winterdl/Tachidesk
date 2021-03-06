package ir.armor.tachidesk.database.dataclass

import ir.armor.tachidesk.database.table.MangaStatus

data class MangaDataClass(
    val id: Int,
    val sourceId: Long,

    val url: String,
    val title: String,
    val thumbnailUrl: String? = null,

    val initialized: Boolean = false,

    val artist: String? = null,
    val author: String? = null,
    val description: String? = null,
    val genre: String? = null,
    val status: String = MangaStatus.UNKNOWN.name
)

data class PagedMangaListDataClass(
    val mangaList: List<MangaDataClass>,
    val hasNextPage: Boolean
)
