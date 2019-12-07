<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xpath-default-namespace="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:eg="http://www.tei-c.org/ns/Examples"
    xmlns:xd="http://www.pnp-software.com/XSLTdoc" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="#all">
        
        <xd:doc type="stylesheet">
            <xd:short>
                EN: This file has been prepared for you to add your personal XSLT templates
                IT: Questo file è stato predisposto per accogliere template personalizzati
            </xd:short>
        </xd:doc>
    <!-- In order to make it work properly you need to add mode="interp dipl #default" to each template -->
    
    <!-- Handle interesting elements -->
    <xsl:template match="tei:note | tei:bibl | tei:material | tei:label | tei:measure | tei:author | tei:pubPlace" mode="interp dipl #default" priority="9">
        <xsl:choose>
            <xsl:when test="self::tei:measure[@type='duodecimo'] | self::tei:measure[@type='octavo'] | self::tei:measure[@type='folio'] | self::tei:measure[@type='quarto']">
                <xsl:element name="span">
                    <xsl:attribute name="class"
                        select="concat('popup ', name())"/>
                    <xsl:attribute name="data-label">format</xsl:attribute>
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:element name="span">
                        <xsl:attribute name="class">trigger</xsl:attribute>
                        <xsl:apply-templates mode="#current"/>
                    </xsl:element>
                    <xsl:element name="span">
                        <xsl:attribute name="class">tooltip</xsl:attribute>
                        <xsl:element name="span">
                            <xsl:attribute name="class">before</xsl:attribute>
                        </xsl:element>
                        <xsl:text> (</xsl:text>
                        <xsl:value-of select="@type"/>
                        <xsl:text>) </xsl:text>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:when test="@type">
                <xsl:element name="span">
                    <xsl:attribute name="class"
                        select="concat('popup ', name())"/>
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:element name="span">
                        <xsl:attribute name="class">trigger</xsl:attribute>
                        <xsl:apply-templates mode="#current"/>
                    </xsl:element>
                    <xsl:element name="span">
                        <xsl:attribute name="class">tooltip</xsl:attribute>
                        <xsl:element name="span">
                            <xsl:attribute name="class">before</xsl:attribute>
                        </xsl:element>
                        <xsl:text> (</xsl:text>
                        <xsl:value-of select="@type"/>
                        <xsl:text>) </xsl:text>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:element name="span">
                    <xsl:attribute name="class" select="concat(name(), ' no-info')" />
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:apply-templates mode="#current"/>
                </xsl:element>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>